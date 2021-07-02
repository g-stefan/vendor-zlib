@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set ACTION=%1
if "%1" == "" set ACTION=make

echo -^> %ACTION% vendor-zlib

goto StepX
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:StepX

call :cmdX xyo-cc --mode=%ACTION% --source-has-archive zlib

if not exist output\include\ mkdir output\include
if not exist output\include\zlib.h copy source\zlib.h output\include\zlib.h
if not exist output\include\zconf.h copy source\zconf.h output\include\zconf.h

call :cmdX xyo-cc --mode=%ACTION% @build/source/libz.static.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/libz.dynamic.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/minigzip.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/minizip.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/miniunz.compile
