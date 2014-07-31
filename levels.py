#https://osu.ppy.sh/wiki/Score#Level
#The level of a player is based solely on the player's total score.
#The total score requirement for a given level is as follows:
#5,000 / 3 * (4n^3 - 3n^2 - n) + 1.25 * 1.8^(n - 60), where n <= 100
#26,931,190,829 + 100,000,000,000 * (n - 100), where n >= 101

from __future__ import division #for un-retarding python math truncating
import locale

#for readable big numbers
locale.setlocale(locale.LC_ALL, 'english_us')

def getScore(level):
    if level <= 100:
        score = ((5000 / 3) * ((4 * (level**3)) - (3 * (level**2)) - level)) + (1.25 * (1.8**(level - 60)))
    else:
        score = 26931190829 + 100000000000 * (level - 100)
    return score

for n in range(1,106):
    score = getScore(n)
    gap_score = getScore(n) - getScore(n - 1)
    s = 'Level ' + repr(n) + \
    ':\t\tTotal Score: ' + locale.format("%d", score, grouping=True) + \
    '\t\tScore Gap: ' + locale.format("%d", gap_score, grouping=True)
    print s
    

                                  
