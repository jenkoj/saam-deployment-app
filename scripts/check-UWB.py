#! /usr/bin/python3
import zerorpc

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")
print("Checking active UWB devices...")
print("     " + c.checkActiveDevices())
print("Checking placement (layout) of UWB devices...")
print("     " + c.checkUWBLayout())
