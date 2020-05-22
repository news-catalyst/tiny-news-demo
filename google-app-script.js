function insertShortcode(url) {
  var shortCode = `[embed src=${url}]`;

  var body = DocumentApp.getActiveDocument().getBody();
  body.appendParagraph(shortCode); // this appends the shortcode to the end of the document, not really ideal
}

function onOpen() {
  DocumentApp.getUi() // Or SpreadsheetApp or SlidesApp or FormApp.
      .createMenu('Embed')
      .addItem('Embed Content from URL', 'showPrompt')
      .addToUi();
}

function replaceSelectedText() {
      var selection = DocumentApp.getActiveDocument().getSelection()
      
      if (selection) {
        var elements = selection.getRangeElements();

        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];

          // Only modify elements that can be edited as text; skip images and other non-text elements.
          if (element.getElement().editAsText) {
            var text = element.getElement().editAsText();
            var url = text.getText();
            var shortCode = `[embed src=${url}]`;

            // Bold the selected part of the element, or the full element if it's completely selected.
            // does it being partial matter?
            if (element.isPartial()) {
              DocumentApp.getUi().alert(`selection is partial, not entire element ${element.getStartOffset()} ${element.getEndOffsetInclusive()}`);
            }
            
            text.setText(shortCode);
          }
        }
      }
}

function showPrompt() {
  
  var ui = DocumentApp.getUi(); // Same variations.

  var result = ui.prompt(
    'Embed from social',
    'Enter the URL of the content you\'d like to embed below:',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var url = result.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    insertShortcode(url);
    ui.alert('Inserted a shortcode to embed the content at ' + url + '.');
  } else if (button == ui.Button.CANCEL) {
    // User clicked "Cancel".
    ui.alert('I didn\'t get a URL.');
  } else if (button == ui.Button.CLOSE) {
    // User clicked X in the title bar.
    ui.alert('You closed the dialog.');
  }
}
