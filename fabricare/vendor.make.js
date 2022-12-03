// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor.vendor");

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.copyFile("source/zlib.h", "output/include/zlib.h");
Shell.copyFile("source/zconf.h", "output/include/zconf.h");

global.xyoCCExtra = function() {
	arguments.push(

	    "--inc=output/include",
	    "--use-lib-path=output/lib",
	    "--rc-inc=output/include",

	    "--inc=" + pathRepository + "/include",
	    "--use-lib-path=" + pathRepository + "/lib",
	    "--rc-inc=" + pathRepository + "/include"

	);
	return arguments;
};

var compileProject = {
	"project" : "libz",
	"includePath" : [
		"output/include",
		"source",
	],
	"cSource" : [
		"source/adler32.c",
		"source/compress.c",
		"source/crc32.c",
		"source/uncompr.c",
		"source/deflate.c",
		"source/trees.c",
		"source/zutil.c",
		"source/inflate.c",
		"source/infback.c",
		"source/inftrees.c",
		"source/inffast.c",
		"source/gzread.c",
		"source/gzwrite.c",
		"source/gzlib.c",
		"source/gzclose.c"
	],
	"linkerDefinitionsFile" : "source/win32/zlib.def",
	"resources" : {
		"includePath" : [
			"source"
		],
		"rcSource" : [
			"source/win32/zlib1.rc"
		]
	}
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib", "--crt-static")));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
Shell.copyFile("output/lib/libz.lib", "output/lib/zlib.lib");
Shell.copyFile("output/lib/libz.lib", "output/lib/zdll.lib");

var compileProject = {
	"project" : "minigzip",
	"includePath" : [
		"output/include",
		"source"
	],
	"cSource" : [ "source/test/minigzip.c" ],
	"library" : [ "libz.static" ]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin", "--crt-static")));

var compileProject = {
	"project" : "miniunz",
	"includePath" : [
		"output/include",
		"source",
		"source/contrib/minizip"
	],
	"cSource" : [
		"source/contrib/minizip/miniunz.c",
		"source/contrib/minizip/unzip.c",
		"source/contrib/minizip/ioapi.c",
		"source/contrib/minizip/iowin32.c"
	],
	"library" : [ "libz.static" ]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin", "--crt-static")));

var compileProject = {
	"project" : "minizip",
	"includePath" : [
		"output/include",
		"source",
		"source/contrib/minizip"
	],
	"cSource" : [
		"source/contrib/minizip/minizip.c",
		"source/contrib/minizip/zip.c",
		"source/contrib/minizip/ioapi.c",
		"source/contrib/minizip/iowin32.c"
	],
	"library" : [ "libz.static" ]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin", "--crt-static")));
