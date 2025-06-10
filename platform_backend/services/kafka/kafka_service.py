from aiokafka import AIOKafkaProducer
import json
import asyncio

KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"
KAFKA_TOPIC = "dashboard-events"

producer: AIOKafkaProducer | None = None

async def get_kafka_producer():
    global producer
    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        await producer.start()
    return producer

async def send_kafka_event(event_type: str, payload: dict):
    producer = await get_kafka_producer()
    await producer.send_and_wait(KAFKA_TOPIC, {"type": event_type, **payload})