import time
import csv
import socket
import subprocess 
import zerorpc
import sys
import os
 


def get_service(service_name):
	cntr = 1
	while True:
		avahi = subprocess.check_output(["avahi-browse","-rptk","_remote._tcp"])
		avahi = csv.reader(avahi.decode().split('\n'), delimiter=';')
		for row in avahi:
			if row and row[0] == "=" and service_name in row:
				try:
					socket.inet_aton(row[7])
					srv = row[7] # #":" + row[8]
					#print("Service " + service_name + " discovered: " + srv)
					return srv
				except socket.error:
					pass
		time.sleep(5)
		cntr += 3
		if cntr > 1:
			print("Device not found, please try again. Check if PMC is connected to power.",end='')
			exit()
		
		
			
#first start avahi-daemon with "service_name"
service_name = "saam-pmc"
ip = get_service(service_name)
c = zerorpc.Client()
c.connect("tcp://%s:4503" % ip)

#state.txt tells us when to stop the program
f2 = open("state.txt","w")
f2.write("1")
status = 1

#clear file
f = open("data.csv","w+")

while status == 1:
	if True:
			try:
				#c.read is zerorpc call
				msg = c.read(" ")
				#print(msg,end='') #comment this line after debuging
				f = open("data.csv","a") #maybe you dont need that line
				f.write(msg)
				f.close()

			except:
					print("corrupted data",end='')           
	sys.stdout.flush()
	time.sleep(.25)
	f2 = open("state.txt","r")
	status = int(f2.read())
	f2.close()



