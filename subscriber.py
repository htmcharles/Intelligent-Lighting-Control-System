import paho.mqtt.client as mqtt
import serial
import time

print("=== MQTT Light Controller Subscriber ===")
print("Initializing...")

# Set your serial port and baud rate
try:
    ser = serial.Serial('COM5', 9600, timeout=1)
    print("✓ Connected to Arduino on COM4")
    # Wait for Arduino to initialize
    time.sleep(2)
    initial_msg = ser.readline().decode().strip()
    while initial_msg:  # Read all initial messages
        print(f"Arduino: {initial_msg}")
        initial_msg = ser.readline().decode().strip()
except Exception as e:
    print(f"✗ Error connecting to Arduino: {str(e)}")
    raise e

# Store schedule
schedule = {
    'on_time': None,
    'off_time': None
}

def on_connect(client, userdata, flags, rc):
    print(f"✓ Connected to MQTT broker (result code {rc})")
    client.subscribe("relay/controll")
    print("✓ Subscribed to relay/controll topic")

def on_message(client, userdata, msg):
    try:
        command = msg.payload.decode().strip()
        print("\n=== New Command Received ===")
        print(f"MQTT Command: {command}")
        
        if command in ["ON", "OFF"]:
            print(f"Forwarding to Arduino: {command}")
            ser.write(f"{command}\n".encode())
            
            # Read and print Arduino's response
            print("\nArduino Response:")
            time.sleep(0.1)  # Give Arduino time to respond
            while ser.in_waiting:
                response = ser.readline().decode().strip()
                print(f"  {response}")
        else:
            print(f"✗ Invalid command received: {command}")
            
    except Exception as e:
        print(f"✗ Error processing message: {str(e)}")

# MQTT setup
client = mqtt.Client()
client.on_message = on_message
client.on_connect = on_connect

print("\nConnecting to MQTT broker...")
client.connect("157.173.101.159", 1883, 60)

# Start MQTT loop
print("Starting message loop...\n")
client.loop_forever()
