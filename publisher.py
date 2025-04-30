import time
from datetime import datetime
import paho.mqtt.publish as publish
# Set the times to send ON and OFF (24-hour format)
ON_TIME = "15:30"
OFF_TIME = "15:31"
# MQTT settings
MQTT_BROKER = "157.173.101.159"
TOPIC = "relay/controll"
sent_on = False
sent_off = False
while True:
    current_time = datetime.now().strftime("%H:%M")
    if current_time == ON_TIME and not sent_on:
        publish.single(TOPIC, payload="ON", hostname=MQTT_BROKER)
        print("Sent ON")
        sent_on = True
    if current_time == OFF_TIME and not sent_off:
        publish.single(TOPIC, payload="OFF", hostname=MQTT_BROKER)
        print("Sent OFF")
        sent_off = True
    time.sleep(1)





# import time
# import paho.mqtt.publish as publish
# from datetime import datetime
# # MQTT broker configuration
# MQTT_BROKER = "157.173.101.159"  # Change to your broker's IP if needed
# TOPIC = "relay/controll"
# # Track last sent time to avoid resending
# last_sent = None
# try:
#     while True:
#         now = datetime.now()
#         current_time = now.strftime("%H:%M")
#         if current_time == "15:25" and last_sent != "15:26":
#             publish.single(TOPIC, payload="ON", hostname=MQTT_BROKER)
#             print("Sent ON at 3:25")
#             last_sent = "15:25"
#         elif current_time == "03:26" and last_sent != "15:26":
#             publish.single(TOPIC, payload="OFF", hostname=MQTT_BROKER)
#             print("Sent OFF at 3:01")
#             last_sent = "03:01"
#         time.sleep(1)
# except KeyboardInterrupt:
#     print("Stopped by user.")