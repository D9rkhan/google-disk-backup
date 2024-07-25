function backupFolder() {
  var sourceFolderId = 'ID вашей папки'; // ID исходной папки
  var targetFolderId = 'ID вашей папки'; // ID папки для бэкапа

  var sourceFolder = DriveApp.getFolderById(sourceFolderId);
  var targetFolder = DriveApp.getFolderById(targetFolderId);

  var date = new Date();
  var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd-MM-yyyy_HH-mm-ss');

  // Создаем новую папку с датой и временем в целевой папке
  var backupFolderName = 'backup_' + formattedDate;
  var backupFolder = targetFolder.createFolder(backupFolderName);

  // Копирование всех файлов из исходной папки в папку для бэкапа
  var files = sourceFolder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    file.makeCopy(file.getName(), backupFolder);
  }

  // Копирование всех подкаталогов и их содержимого
  var folders = sourceFolder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    copyFolder(folder, backupFolder);
  }
}

function copyFolder(sourceFolder, targetFolder) {
  var newFolder = targetFolder.createFolder(sourceFolder.getName());

  // Копирование всех файлов в подкаталог
  var files = sourceFolder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    file.makeCopy(file.getName(), newFolder);
  }

  // Копирование всех подкаталогов
  var folders = sourceFolder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    copyFolder(folder, newFolder);
  }
}
