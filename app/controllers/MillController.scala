package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.streams.ActorFlow
import akka.actor._
import akka.stream.Materializer

import com.google.inject.Injector
import com.google.inject.Guice
import de.htwg.se.mill.MillModule
import de.htwg.se.mill.controller.ControllerInterface
import de.htwg.se.mill.util.Messages
import de.htwg.se.mill.util.Observer
import de.htwg.se.mill.aview.TUI
import de.htwg.se.mill.util.Event
import scala.concurrent.Future

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class MillController @Inject() (
    val controllerComponents: ControllerComponents
)(implicit system: ActorSystem, mat: Materializer)
    extends BaseController {
  private val injector: Injector = Guice.createInjector(new MillModule)
  private var gameController =
    injector.getInstance(classOf[ControllerInterface])
  private var tui = new TUI(gameController)
  private var errorMessage = new String
  private val channels =
    scala.collection.mutable.Map[(String, String), ActorRef]()

  def index() = Action { implicit request: Request[AnyContent] => onIndex }

  def channel = WebSocket.acceptOrResult[JsValue, JsValue] { request =>
    Future.successful {
      val remoteAddress = request.headers.get("remote-address").get
      val remoteId = (remoteAddress.split(":")(0), remoteAddress.split(":")(1))
      if (channels.size == 2) {
        Left(TooManyRequests)
      } else if (channels.nonEmpty && channels.contains(remoteId)) {
        Left(BadRequest)
      } else {
        Right(ActorFlow.actorRef { channel =>
          println("Connection established")
          channels.addOne(remoteId, channel)
          SudokuWebSocketActorFactory.create(channel)
        })
      }
    }
  }

  private def onIndex(implicit request: Request[AnyContent]): Result = Ok(
    views.html.main()
  )

  private def restart = {
    gameController = injector.getInstance(classOf[ControllerInterface])
    tui = new TUI(gameController)
    errorMessage = new String
    channels.empty
  }

  private object SudokuWebSocketActorFactory {
    def create(channel: ActorRef) = {
      Props(new SudokuWebSocketActor(channel))
    }
  }

  private object GameEvent extends Enumeration {
    type GameEvent = Value
    val WAITING_FOR_SECOND_PLAYER, GAME_STARTED, GAME_INTRODUCTION,
        GAME_PLAYING = Value
  }

  private class SudokuWebSocketActor(channel: ActorRef)
      extends Actor
      with Observer {
    gameController.add(this)

    override def preStart(): Unit = {
      if (gameController.gameState.isEmpty) {
        channel ! gameIntroduction
      } else {
        channel ! newGame
      }
    }

    private def gameIntroduction = JsObject(
      Seq(
        "event" -> JsString(GameEvent.GAME_INTRODUCTION.toString),
        "page" -> JsString(views.html.index(Messages.introductionText).body)
      )
    )

    private def newGame = JsObject(
      Seq(
        "event" -> JsString(GameEvent.GAME_STARTED.toString),
        "page" -> JsString(
          views.html
            .mill(
              gameController.currentGameState,
              gameController.gameState.get.game.currentPlayer.toString,
              errorMessage,
              gameController.gameState.get.game.board
            )
            .body
        )
      )
    )

    def receive = {
      case msg: JsValue => {
        val playerNameField = msg \ "playerName"
        if (
          playerNameField.isDefined && !playerNameField.get.as[String].isBlank
        ) {
          val playerName = playerNameField.get.as[String]
          if (!gameController.hasFirstPlayer) {
            gameController.addFirstPlayer(playerName)
            channel ! JsObject(
              Seq(
                "event" -> JsString(
                  GameEvent.WAITING_FOR_SECOND_PLAYER.toString
                )
              )
            )
          } else if (!gameController.hasSecondPlayer) {
            gameController.addSecondPlayer(playerName)
            gameController.newGame
            channels.values.foreach(channel => {
              channel ! newGame
            })
          }
        } else {
          val command = msg \ "command"
          if (command.isDefined) {
            tui.onInput(command.get.as[String])
          }
        }
      }
    }

    override def update(message: Option[String], e: Event.Value) =
      e match {
        case Event.QUIT => {
          restart
          channel ! gameIntroduction
        }
        case Event.PLAY => {
          errorMessage = if (message.isDefined) message.get else new String
          channel ! JsObject(
            Seq(
              "event" -> JsString(GameEvent.GAME_PLAYING.toString),
              "board" -> gameController.gameState.get.game.board.toJson,
              "currentPlayer" -> JsString(
                gameController.gameState.get.game.currentPlayer.toString
              ),
              "gameState" -> JsString(gameController.currentGameState),
              "errorMessage" -> JsString(errorMessage)
            )
          )
        }
      }
  }
}
