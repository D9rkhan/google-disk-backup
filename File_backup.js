function backupSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = spreadsheet.getName();
  var date = new Date();
  
  // Форматирование даты для имени папки и файла
  var formattedDateFolder = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy');
  var formattedDateFile = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy_HH-mm-ss');
  
  var backupFileName = sheetName + "_backup_" + formattedDateFile;
  
  // Замените 'YOUR_FOLDER_ID' на ID вашей основной папки
  var folderId = '16Ek2plI3ZtfTDRIEFH_teE3u7YgY2g0'; // Пример ID
  var mainFolder = DriveApp.getFolderById(folderId);
  
  // Проверяем, существует ли папка с текущей датой
  var folders = mainFolder.getFoldersByName(formattedDateFolder);
  var folder;
  
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    // Если папка не существует, создаем её
    folder = mainFolder.createFolder(formattedDateFolder);
  }
  
  // Создание нового файла Google Таблицы
  var newSpreadsheet = SpreadsheetApp.create(backupFileName);
  
  // Копирование всех листов из исходного файла в новый с сохранением форматирования
  var sourceSheets = spreadsheet.getSheets();
  
  for (var i = 0; i < sourceSheets.length; i++) {
    var sourceSheet = sourceSheets[i];
    var sheetName = sourceSheet.getName();
    
    // Создаем новый лист в новом файле
    var newSheet = newSpreadsheet.insertSheet(sheetName);
    
    // Копирование данных и форматирования
    var range = sourceSheet.getDataRange();
    var values = range.getValues();
    var backgrounds = range.getBackgrounds();
    var fonts = range.getFontWeights();
    var fontColors = range.getFontColors();
    var fontSizes = range.getFontSizes();
    
    // Устанавливаем значения и форматирование в новый лист
    var targetRange = newSheet.getRange(1, 1, values.length, values[0].length);
    targetRange.setValues(values);
    targetRange.setBackgrounds(backgrounds);
    targetRange.setFontWeights(fonts);
    targetRange.setFontColors(fontColors);
    targetRange.setFontSizes(fontSizes);
  }
  
  // Удаление стандартного листа (пустого листа) из нового файла
  var defaultSheet = newSpreadsheet.getSheetByName('Sheet1');
  if (defaultSheet) {
    newSpreadsheet.deleteSheet(defaultSheet);
  }
  
  // Перемещение нового файла в созданную папку
  var newFileId = newSpreadsheet.getId();
  var newFile = DriveApp.getFileById(newFileId);
  folder.addFile(newFile);
  DriveApp.getRootFolder().removeFile(newFile); // Удаление из корневой папки
  
  // Уведомление о завершении процесса
  Logger.log('Бэкап создан и сохранен в папке с именем: ' + formattedDateFolder);
}
