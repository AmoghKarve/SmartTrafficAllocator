from __future__ import division
import cv2
import time
import sys
from cgi import FieldStorage
import json
import ssl
import cgitb

cgitb.enable()

print("Content-Type: text/html\n")
form = FieldStorage()
message = form.getvalue("message", "error")
message = json.loads(message)
print message['source1']
source1 = message['source1']
source2 = message['source2']
source3 = message['source3']
source4 = message['source4']

def calculateDensity(videoSource, abcd) :
    # capture frames from a video

    cap = cv2.VideoCapture(videoSource)

    # Trained XML classifiers describes some features of some object we want to detect
    car_cascade = cv2.CascadeClassifier('cars.xml')
    count = 0
    max = -1
    curr_time = time.time()
    n  = 1
    # loop runs if capturing has been initialized.
    while True:
        # reads frames from a video
        ret, frames = cap.read()
        #count = 0
        if ret:

            # convert to gray scale of each frames
            gray = cv2.cvtColor(frames, cv2.COLOR_BGR2GRAY)

            cv2.line(frames, (100,125), (400, 125), (0,0,255))
            cv2.line(frames, (100,95), (400, 95), (0,0,255))
            # Detects cars of different sizes in the input image
            cars = car_cascade.detectMultiScale(gray, 1.1, int(abcd))

            # To draw a rectangle in each cars
            for (x,y,w,h) in cars:
                count = count + 1
            '''
            now_time = time.time()
            print now_time - curr_time
            if now_time - curr_time < n :
                time.sleep(n - (now_time - curr_time))
                n = n + 1
                #break
            # Display frames in a window
            if now_time - curr_time > 5:
                break
            #cv2.imshow('video2', frames)
            '''
            # Wait for Esc key to stop
            if cv2.waitKey(33) == 27:
                break
        else:
            break
    # De-allocate any associated memory usage
    cv2.destroyAllWindows()
    return count

d1 = calculateDensity(source1, 4)
d2 = calculateDensity(source2, 4)
d3 = calculateDensity(source3, 2)
d4 = calculateDensity(source4, 3)
#print (d1, d2, d3, d4)
sumd = d1 + d2 + d3 + d4

d1 = d1 / sumd
d2 = d2 / sumd
d3 = d3 / sumd
d4 = d4 / sumd


data = [(1, d1), (2, d2), (3, d3), (4, d4)]
data.sort(key = lambda tup : tup[1])
print data
