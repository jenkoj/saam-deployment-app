#! /usr/bin/python3
import zerorpc

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

if (c.checkActiveDevices() == OK and c.checkUWBLayout == OK):
   print("OK")

elif c.checkActiveDevices() != OK:
   print("ERROR: not enough devices connected")
 
elif c.checkUWBLayout != OK:
   print("ERROR: Bad placement, please place devices in a triangular shape")

