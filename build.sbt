name := "Mill"
organization := "de.htwg.wt.mill"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.9"

libraryDependencies ++= Seq(
  guice,
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "org.webjars" % "bootstrap" % "5.1.3" exclude ("org.webjars", "jquery"),
  "org.webjars" % "jquery" % "3.6.1",
  "org.webjars.npm" % "vue" % "3.2.41"
)
// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.wt.mill.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.wt.mill.binders._"
