name := "Mill"
organization := "de.htwg.wt.mill"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.9"

libraryDependencies ++= Seq(
  guice,
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5"
)

includeFilter in (Assets, LessKeys.less) := "*.less"
excludeFilter in (Assets, LessKeys.less) := "_*.less"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.wt.mill.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.wt.mill.binders._"
