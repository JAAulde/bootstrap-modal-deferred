# bootstrap-modal-deferred
A wrapper to the standard Bootstrap Modal component that returns a promise that will be rejected or resolved via interaction with the modal.

**Documentation is being written! Until then:**

## Simplest Example
````javascript
$('#confirm_dialog').modalDeferred()
	.done(function () {
		alert('Confirmed!');
	})
	.fail(function () {
		alert('Canceled!');
	});
````

## Demo
For now, you can also checkout this [JSFiddle demo](https://jsfiddle.net/JAAulde/4cbL8jqr/).