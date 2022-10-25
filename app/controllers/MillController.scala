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
  var gameMessage: String = ""
  gameController.add(this)

  override def update(message: Option[String], e: Event.Value) = {
    e match {
      case Event.QUIT => gameMessage = "quit"
      case Event.PLAY =>
        if (message.isDefined) gameMessage = message.get
        else
          gameMessage =
            s"${gameController.gameState.get.game.currentPlayer}'s turn(${gameController.currentGameState}): " + gameController.gameState.get.game.board
    }
  }

  /** Create an Action to render an HTML page.
    *
    * The configuration in the `routes` file means that this method will be
    * called when the application receives a `GET` request with a path of `/`.
    */
  def about() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def index = Action { implicit request: Request[AnyContent] =>
    if (!gameController.hasFirstPlayer)
      Ok(Messages.introductionText)
    else if (!gameController.hasSecondPlayer)
      Ok(Messages.addSecondPlayerText)
    else
      Ok(gameMessage)
  }

  def command(cmd: String) = Action { implicit request: Request[AnyContent] =>
    onCommand(cmd)
  }

  private def onCommand(cmd: String): Result = {
    if (!gameController.hasFirstPlayer && !cmd.isBlank) {
      gameController.addFirstPlayer(cmd)
      return Ok(Messages.addSecondPlayerText)
    } else if (!gameController.hasSecondPlayer && !cmd.isBlank) {
      gameController.addSecondPlayer(cmd)
      gameController.newGame
    } else if (!cmd.isBlank) {
      tui.onInput(cmd)
    }
    Ok(gameMessage)
  }
}
