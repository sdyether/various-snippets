#for when I can't decide what show to watch
#put this file in a folder containing backlog episodes
#it will choose a random show, and start the first unwatched ep of it

import os
import re
import sys
#import time
from random import choice

files = [i for i in os.listdir(".") if os.path.isfile(i) and i != os.path.basename(__file__)] #script can live in anime folder
workingfiles = []
finalfiles = []
random = []

for f in files:
  brackets = [0]
  for m in re.finditer('\[', f):
    brackets.append(m.start())
  for m in re.finditer('\]', f):
    brackets.append(m.start()+1)
  brackets.sort()
  brackets.append(len(f))  
  if (len(brackets) % 2) == 1: #parity-tier erroneous logic
    print('Warning, unmatched brackets')
    sys.exit()
    
  #now do magic to get filename
  workingfiles.append(files[len(workingfiles)])
  beforeString = workingfiles.pop()
  l = []
  index = 0
  while (index < len(brackets)):
    l.append(beforeString[brackets[index]:brackets[index+1]])
    if (l[-1][:1] == '_' or l[-1][:1] == ' '):
      l[-1] = l[-1][1:] #fix up leading space/underscore
    index+=2
  
  afterString = ''.join(l)
  workingfiles.append(afterString)

  #now scan until ep number
  n = re.search('\d', afterString)
  if n:
    shortname = afterString[:n.start(0)]
    if shortname not in finalfiles:
      finalfiles.append(shortname)
      random.append(f)
  else:
    finalfiles.append(afterString)
    random.append(f)

episode = choice(random)
print (episode)
os.startfile(episode) #RIP backlog
#time.sleep(3)
  
  
