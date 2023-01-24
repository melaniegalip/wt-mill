import com.typesafe.sbt.packager.docker.DockerChmodType
import com.typesafe.sbt.packager.docker.DockerPermissionStrategy

dockerChmodType := DockerChmodType.UserGroupWriteExecute
dockerPermissionStrategy := DockerPermissionStrategy.CopyChown

javacOptions ++= Seq("-source", "1.8", "-target", "1.8")

name := "Mill"
organization := "de.htwg.wt.mill"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala, DockerPlugin)

scalaVersion := "2.13.9"

// standard tcp ports
dockerExposedPorts ++= Seq(9000, 9001)

// for udp ports
dockerExposedUdpPorts += 4444

libraryDependencies ++= Seq(
  guice,
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5"
)
// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.wt.mill.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.wt.mill.binders._"
