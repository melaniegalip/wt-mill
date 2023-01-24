# Install Java and set the JAVA_HOME variable
FROM azul/zulu-openjdk:8

ENV SBT_VERSION 1.7.1

# Install curl and vim
RUN \
  apt-get update && \
  apt-get -y install curl && \
  apt-get -y install vim

# Install both scala and sbt
RUN \
  curl -L -o sbt-$SBT_VERSION.deb https://repo.scala-sbt.org/scalasbt/debian/sbt-$SBT_VERSION.deb && \
  dpkg -i sbt-$SBT_VERSION.deb && \
  rm sbt-$SBT_VERSION.deb && \
  apt-get update && \
  apt-get -y install sbt

WORKDIR /var/www
COPY . /var/www

RUN sbt compile
EXPOSE 80
CMD ["sbt","run"]