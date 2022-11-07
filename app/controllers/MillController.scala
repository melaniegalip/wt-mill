package controllers

import javax.inject._
import play.api._
import play.api.mvc._
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

  var gameStatus: String = ""
  var errorMessage: Option[String] = None

  override def update(message: Option[String], e: Event.Value) = {
    e match {
      case Event.QUIT => gameStatus = "The game has been quitted."
      case Event.PLAY =>
        if (message.isDefined) errorMessage = message
        else
          gameStatus =
            s"${gameController.gameState.get.game.currentPlayer}'s turn(${gameController.currentGameState})"
    }
  }

  def index = Action { implicit request: Request[AnyContent] =>
    if (!gameController.hasFirstPlayer)
      Ok(views.html.index(Messages.introductionText))
    else if (!gameController.hasSecondPlayer)
      Ok(views.html.index(Messages.addSecondPlayerText))
    else
      Ok(
        views.html.mill(
          gameStatus,
          errorMessage,
          gameController.gameState.get.game.board
        )
      )
  }

  def command(cmd: String) = Action { implicit request: Request[AnyContent] =>
    onCommand(cmd)
  }

  private def onCommand(cmd: String): Result = {
    if (!gameController.hasFirstPlayer && !cmd.isBlank) {
      gameController.addFirstPlayer(cmd)
      return Ok(views.html.index(Messages.addSecondPlayerText))
    } else if (!gameController.hasSecondPlayer && !cmd.isBlank) {
      gameController.addSecondPlayer(cmd)
      gameController.newGame
    } else if (!cmd.isBlank) {
      tui.onInput(cmd)
    }
    Ok(
      views.html
        .mill(gameStatus, errorMessage, gameController.gameState.get.game.board)
    )
  }
}
