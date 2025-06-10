import asyncio
from aiokafka import AIOKafkaConsumer
import json
import logging

logging.basicConfig(level=logging.INFO)


async def consume_dashboard_events():
    consumer = AIOKafkaConsumer(
        "dashboard-events",
        bootstrap_servers="kafka:9092",
        group_id="dashboard-logger",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    )
    await consumer.start()
    try:
        async for msg in consumer:
            event = msg.value
            logging.info(f"📝 Dashboard Event: {event['event']} -> {event['data']}")
    finally:
        await consumer.stop()


if __name__ == "__main__":
    asyncio.run(consume_dashboard_events())
