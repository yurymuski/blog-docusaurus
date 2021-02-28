---
slug: /kafka/
id: kafka
title: Kafka useful
---

## Kafka Topics

### Create topic, add message and check it
```sh
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic TestTopic
echo "Hello, World" | /opt/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TestTopic > /dev/null
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic TestTopic --from-beginning
```

### List existing topics
```sh
bin/kafka-topics.sh --zookeeper localhost:2181 --list
```

### Describe a topic
```sh
bin/kafka-topics.sh --zookeeper localhost:2181 --describe --topic mytopic
bin/kafka-configs.sh --zookeeper localhost:2181 --describe --entity-type topics
```

### Configure a topic
```sh
bin/kafka-configs.sh --zookeeper localhost:2181 --add-config retention.bytes=10737418240 --entity-type topics --entity-name telegraf --alter
bin/kafka-configs.sh --zookeeper localhost:2181 --delete-config retention.bytes --entity-type topics --entity-name telegraf --alter
```

### Purge a topic
```sh
bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic mytopic --config retention.ms=1000
#... wait a minute ...
bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic mytopic --delete-config retention.ms
```

### Delete a topic
```sh
bin/kafka-topics.sh --zookeeper localhost:2181 --delete --topic mytopic
```

### Get number of messages in a topic
```sh
bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic mytopic --time -1 --offsets 1 | awk -F ":" '{sum += $3} END {print sum}'
```

### Get the earliest offset still in a topic
```sh
bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic mytopic --time -2
```

### Get the latest offset still in a topic
```sh
bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic mytopic --time -1
```

## Kafka Consumer
### Consume (READ) messages with the console consumer
```sh
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic mytopic --from-beginning

bin/kafka-console-consumer.sh --bootstrap-server kafka.bdtech.local:9092 --topic telegraf | grep responce
```

### Get the consumer offsets for a topic
```sh
bin/kafka-consumer-offset-checker.sh --zookeeper=localhost:2181 --topic=mytopic --group=my_consumer_group
```

### Read from __consumer_offsets
```sh
Add the following property to config/consumer.properties: exclude.internal.topics=false
bin/kafka-console-consumer.sh --consumer.config config/consumer.properties --from-beginning --topic __consumer_offsets --zookeeper localhost:2181 --formatter "kafka.coordinator.GroupMetadataManager\$OffsetsMessageFormatter"
```

## Kafka Consumer Groups
### List the consumer groups known to Kafka
```sh
bin/kafka-consumer-groups.sh  --list --bootstrap-server localhost:9092
```

### View the details of a consumer group
```sh
bin/kafka-consumer-groups.sh  --describe --bootstrap-server localhost:9092 --group <group name>
```


## Sentry kafka cleanup
```sh

# space issue
du -Sh / | sort -rh | head -15
# 30G    /var/lib/docker/volumes/sentry-kafka/_data/ingest-events-0
# 24G    /var/lib/docker/volumes/sentry-kafka/_data/events-0

# go inside container 
docker exec -it sentry_onpremise_kafka_1 bash

# Check topic size on disk:
kafka-log-dirs --describe --bootstrap-server localhost:9092 --topic-list ingest-events

# set retention for 1sec and wait for cleanup
kafka-configs --zookeeper zookeeper:2181 --entity-type topics --alter --entity-name ingest-events --add-config retention.ms=1000

# revert retention back
kafka-configs --zookeeper zookeeper:2181 --entity-type topics --alter --entity-name ingest-events --delete-config retention.ms
kafka-topics --zookeeper zookeeper:2181 --describe --topic ingest-events
```




## kafkacat
Getting the last five message of a topic
```sh
kafkacat -C -b localhost:9092 -t mytopic -p 0 -o -5 -e
```

## Zookeeper
Starting the Zookeeper Shell
```sh
bin/zookeeper-shell.sh localhost:2181
```

## Kafka exporter
```sh
sudo mkdir /opt/jmx_exporter
cd /opt/jmx_exporter/
sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.3.1/jmx_prometheus_javaagent-0.3.1.jar
sudo wget https://raw.githubusercontent.com/prometheus/jmx_exporter/master/example_configs/kafka-2_0_0.yml

# add exporter to KAFKA_OPTS  /opt/kafka/bin/kafka-server-start.sh

export KAFKA_OPTS="$KAFKA_OPTS -javaagent:/opt/jmx_exporter/jmx_prometheus_javaagent-0.3.1.jar=9216:/opt/jmx_exporter/kafka-2_0_0.yml"

```


