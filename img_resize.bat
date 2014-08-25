::Script to quickly resize and compress large images for sharing
::Drag and drop an image or pass image as command line param
::creates a copy so as not to replace to original image

::Dependancy is imagemagick installed on the machine, and in the system path

@echo off

::set vars
set image=%1
set quality=99
set width=1300
set ftype=jpg
for /F %%i in ("%image%") do set base_fname=%%~ni
set final_fname=%base_fname%_%width%

::create new image
convert %image% -resize %width%x -quality %quality% %final_fname%.%ftype%