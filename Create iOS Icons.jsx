if (Math.floor(version.split(".")[0]) > 12) {
  if(app.documents.length > 0) {
    showDialog();
  } else {
    alert("This script requires an document!");
  }
} else {
  alert("This script requires Illustrator CS!");
}

function showDialog() {
  var document = app.activeDocument,
      dialog = new Window("dialog", "Select Icon Options");

  dialog.textGroup = dialog.add("group", undefined, "");
  dialog.textGroup.label = dialog.textGroup.add("statictext", [0,0,35,15], "Prefix");
  dialog.textGroup.prefix = dialog.textGroup.add("edittext", [40,0,200,17], "");

  dialog.iconGroup = dialog.add("group", undefined, "");
  dialog.iconGroup.iosAppIcon = dialog.iconGroup.add("checkBox", [25,25,235,39], "iOS App Icon");
  dialog.iconGroup.iosAppIcon6 = dialog.iconGroup.add("checkBox", [55,25,235,39], "Include ≤ iOS 6.1");
  dialog.iconGroup.iosBarIcon = dialog.iconGroup.add("checkBox", [25,25,235,39], "iOS Bar Icon");
  dialog.iconGroup.iosAppIcon.value = true;
  dialog.iconGroup.iosBarIcon.value = true;
  dialog.iconGroup.orientation = "column";

  dialog.pathGroup = dialog.add("group", undefined, "");
  dialog.pathGroup.label = dialog.pathGroup.add("statictext", [0,0,35,15], "Path");
  dialog.pathGroup.path = dialog.pathGroup.add("edittext", [40,0,200,20], document.path);
  dialog.pathGroup.button = dialog.add("button", [250,0,350,20], "Select Path...");
  dialog.pathGroup.button.onClick = function() {
    dialog.pathGroup.path.text = Folder.selectDialog();
  };

  dialog.buttonGroup = dialog.add("group", undefined, "");
  dialog.buttonGroup.orientation = "row";
  dialog.buttonGroup.cancelButton = dialog.buttonGroup.add("button", [15,15,115,35], "Cancel", {name:"cancel"});
  dialog.buttonGroup.okButton = dialog.buttonGroup.add("button", [125,15,225,35], "OK", {name:"ok"});
  dialog.buttonGroup.cancelButton.onClick = function() {
    dialog.hide();
  };
  dialog.buttonGroup.okButton.onClick = function() {
    dialog.hide();
    performAction(document, {
      prefix: dialog.textGroup.prefix.text,
      iosAppIcon: dialog.iconGroup.iosAppIcon.value,
      iosAppIcon6: dialog.iconGroup.iosAppIcon6.value,
      iosBarIcon: dialog.iconGroup.iosBarIcon.value,
      path: dialog.pathGroup.path.text
    });
  };

  dialog.show();
}

function performAction(document, options) {
  var documentName = document.name.replace(".ai",""),
      path = options["path"] + "/";

  if (options["prefix"]) {
    path += options["prefix"];
  }
  path += documentName;

  if (options["iosAppIcon"]) {
    export(document,  512, path, "iTunesArtwork", "");    // App list in iTunes
    export(document, 1024, path, "iTunesArtwork", "@2x"); // App list in iTunes for devices with retina display
    export(document,  120, path, "Icon-60",       "@2x"); // Home screen on iPhone/iPod Touch with retina display
    export(document,  180, path, "Icon-60",       "@3x"); // Home screen on iPhone 6 Plus
    export(document,   76, path, "Icon-76",       "");    // Home screen on iPad
    export(document,  152, path, "Icon-76",       "@2x"); // Home screen on iPad with retina display
    export(document,   40, path, "Icon-Small-40", "");    // Spotlight
    export(document,   80, path, "Icon-Small-40", "@2x"); // Spotlight on devices with retina display
    export(document,  120, path, "Icon-Small-40", "@3x"); // Spotlight on iPhone 6 Plus
    export(document,   29, path, "Icon-Small",    "");    // Settings and Spotlight on iPhone/iPod Touch (iOS 6.1 and earlier)
    export(document,   58, path, "Icon-Small",    "@2x"); // Settings on devices with retina display and Spotlight on iPhone/iPod Touch with retina display (iOS 6.1 and earlier)
    export(document,   87, path, "Icon-Small",    "@3x"); // Settings on iPhone 6 Plus
    if (options["iosAppIcon6"]) {
      export(document,   57, path, "Icon",          "");    // Home screen on iPhone/iPod touch (iOS 6.1 and earlier)
      export(document,  114, path, "Icon",          "@2x"); // Home screen on iPhone/iPod Touch with retina display (iOS 6.1 and earlier)
      export(document,   72, path, "Icon-72",       "");    // Home screen on iPad (iOS 6.1 and earlier)
      export(document,  144, path, "Icon-72",       "@2x"); // Home screen on iPad with retina display (iOS 6.1 and earlier)
      export(document,   50, path, "Icon-Small-50", "");    // Spotlight on iPad (iOS 6.1 and earlier)
      export(document,  100, path, "Icon-Small-50", "@2x"); // Spotlight on iPad with retina display (iOS 6.1 and earlier)
    }
  }
  if (options["iosBarIcon"]) {
    export(document, 25, path, "", "");
    export(document, 50, path, "", "@2x");
    export(document, 75, path, "", "@3x");
  }
}

function export(document, scale, folderName, staticFileName, suffix) {
	var fileName, file, exportOptions, i,
      folder = new Folder(folderName);

	if (!folder.exists) {
    folder.create();
  }

	for (i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);

    if (staticFileName != "") {
      if (i < document.artboards.length - 1) {
        break;
      } else {
        fileName = staticFileName;
      }
    } else {
      fileName = document.artboards[i].name;
    }

		file = new File(folder.fsName + "/" + fileName + suffix + ".png");

		exportOptions = new ExportOptionsPNG24();
		exportOptions.artBoardClipping = true;
    exportOptions.antiAliasing = true;
    exportOptions.transparency = true;
    exportOptions.horizontalScale = scale;
    exportOptions.verticalScale = scale;

		document.exportFile(file, ExportType.PNG24, exportOptions);
	}
}
