FROM eclipse-temurin:21-jre

ENV MB_DB_FILE=/metabase-data/metabase.db \
    FC_LANG=en-US \
    LC_CTYPE=en_US.UTF-8 \
    MB_ANON_TRACKING_ENABLED=false

RUN apt-get update -yq && apt-get install -yq curl fonts-dejavu fontconfig && \
    apt-get clean && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/ && \
    mkdir -p /certs /metabase-data /app && \
    useradd --shell /bin/bash --home /app metabase && \
    curl -o /app/metabase.jar https://downloads.metabase.com/v0.46.6/metabase.jar && \
    chown -R metabase:metabase /app /metabase-data

USER metabase
WORKDIR /app

EXPOSE 3000
ENTRYPOINT ["java", "-jar", "/app/metabase.jar"]