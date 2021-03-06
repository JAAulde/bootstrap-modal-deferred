# bootstrap-modal-deferred
A wrapper to the standard [Bootstrap](http://getbootstrap.com) [modal component](http://getbootstrap.com/javascript/#modals) that returns a promise ([jQuery deferred](https://api.jquery.com/category/deferred-object/)) that will be rejected or resolved via interaction with the modal.

**Documentation is being written! Until then:**

## installation
### [bower](http://bower.io)
````bash
bower install bootstrap-modal-deferred
````

### [npm](https://www.npmjs.com)
````bash
npm install bootstrap-modal-deferred
````

### html
Download the code, link it in your HTML file.
````html
<script src="/path/to/bootstrap-modal-deferred.js"></script>
````

## Usage
### Simplest Example
````javascript
$('#confirm_dialog').modalDeferred()
	.done(function () {
		alert('Confirmed!');
	})
	.fail(function () {
		alert('Canceled!');
	});
````

### Demo
For now, you can also checkout this [JSFiddle demo](https://jsfiddle.net/JAAulde/4cbL8jqr/).

## Roadmap:
 1. Allow `data-promise-*` elements to provide parameters to `resolve` and `reject`
 2. Documentation!