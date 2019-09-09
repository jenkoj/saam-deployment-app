#! /usr/bin/python3
import zerorpc

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

if (c.checkActiveDevices() == "OK" and c.checkUWBLayout() == "OK"):
   print("OK",end='')

elif c.checkActiveDevices() != "OK":
   print("Not enough devices connected.",end='')
 
elif c.checkUWBLayout() != "OK":
   print("Bad placement - please place devices in a triangular shape.",end='')

