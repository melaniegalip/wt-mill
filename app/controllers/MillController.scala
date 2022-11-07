package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._

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
) extends BaseController
    with Observer {

  val injector: Injector = Guice.createInjector(new MillModule)
  val gameController = injector.getInstance(classOf[ControllerInterface])
  val tui = new TUI(gameController)
  gameController.add(this)

  var gameState: String = ""
  var currentPlayer: String = ""
  var errorMessage: String = ""

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

  def index(playerName: String) = Action {
    implicit request: Request[AnyContent] =>
      onIndex(playerName)
  }

  def command(cmd: String) = Action { implicit request: Request[AnyContent] =>
    tui.onInput(cmd)
    Ok(
      JsObject(
        Seq(
          "board" -> gameController.gameState.get.game.board.toJson,
          "currentPlayer" -> JsString(currentPlayer),
          "gameState" -> JsString(gameState),
          "errorMessage" -> JsString(errorMessage)
        )
      )
    )
  }

  private def onIndex(playerName: String): Result = {
    if (!gameController.hasFirstPlayer && !playerName.isBlank) {
      gameController.addFirstPlayer(playerName)
      return Ok(views.html.index(Messages.addSecondPlayerText))
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
}
