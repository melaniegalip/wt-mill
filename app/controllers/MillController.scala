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

/** This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class MillController @Inject() (
    val controllerComponents: ControllerComponents
)(implicit system: ActorSystem, mat: Materializer)
    extends BaseController
    with Observer {

  private val injector: Injector = Guice.createInjector(new MillModule)
  private val gameController =
    injector.getInstance(classOf[ControllerInterface])
  private val tui = new TUI(gameController)
  private var gameState: String = ""
  private var currentPlayer: String = ""
  private var errorMessage: String = ""
  gameController.add(this)

  def index(playerName: String) = Action {
    implicit request: Request[AnyContent] =>
      onIndex(request, playerName)
  }

  def command(cmd: String) = Action { implicit request: Request[AnyContent] =>
    tui.onInput(cmd)
    Ok
  }

  def channel = WebSocket.accept[JsValue, JsValue] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      SudokuWebSocketActorFactory.create(out)
    }
  }

  override def update(message: Option[String], e: Event.Value) = {
    e match {
      case Event.QUIT => gameState = "The game has been quitted."
      case Event.PLAY =>
        if (message.isDefined) errorMessage = message.get
        else {
          gameState = gameController.currentGameState
          currentPlayer =
            gameController.gameState.get.game.currentPlayer.toString
          errorMessage = ""
        }
    }
  }

  private def onIndex(
      request: Request[AnyContent],
      playerName: String
  ): Result = {
    println(routes.MillController.channel.webSocketURL(request.asJava))
    if (!gameController.hasFirstPlayer && !playerName.isBlank) {
      gameController.addFirstPlayer(playerName)
      return Ok
    } else if (!gameController.hasSecondPlayer && !playerName.isBlank) {
      gameController.addSecondPlayer(playerName)
      gameController.newGame
    } else if (gameController.gameState.isEmpty) {
      return Ok(views.html.index(Messages.introductionText))
    }

    Ok(
      views.html
        .mill(
          gameState,
          currentPlayer,
          errorMessage,
          gameController.gameState.get.game.board
        )
    )
  }

  object SudokuWebSocketActorFactory {
    def create(out: ActorRef) = {
      Props(new SudokuWebSocketActor(out))
    }
  }

  class SudokuWebSocketActor(out: ActorRef) extends Actor with Observer {
    gameController.add(this)

    private def data = JsObject(
      Seq(
        "board" -> gameController.gameState.get.game.board.toJson,
        "currentPlayer" -> JsString(currentPlayer),
        "gameState" -> JsString(gameState),
        "errorMessage" -> JsString(errorMessage)
      )
    )

    def receive = { case msg: JsValue =>
      out ! (data)
      println("Sent Json to Client" + msg)
    }

    override def update(message: Option[String], e: Event.Value) = send

    private def send = {
      println("Received event from Controller")
      if (gameController.hasSecondPlayer) {
        out ! (data)
      }
    }
  }
}
