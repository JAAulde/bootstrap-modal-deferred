/* jslint */

/**
 * @file bootstrap-modal-deferred.js provides a wrapper to the standard
 *       Bootstrap Modal component that returns a promise that will be rejected
 *       or resolved via interaction with the modal.
 * @version 1.0.0
 * @copyright Jim Auldridge <auldridgej@gmail.com> 2016
 * @license MIT
 * @see {@link https://github.com/JAAulde/bootstrap-modal-deferred|GitHub Repository}
 * @see {@link http://getbootstrap.com/javascript/#modals|Bootstrap Modal}
 * @see {@link https://api.jquery.com/category/deferred-object/|jQuery deferred}
 */
(function (context, undef) {
    'use strict';

    var $ = context.jQuery,
        defaults = {
            /*
             * By default, any dismissal of the modal (interaction with a
             * `data-dismiss="modal"` element) will reject the deferred
             */
            rejectOnDismiss: true,
            /*
             * If the plugin is called against a single element, then by default
             * the plugin will return the deferred instead of the collection.
             */
            returnDeferred: true
        },
        names = {
            DATA_ATTR_PROMISE_DISPATCH: 'data-promise-dispatch',
            DATA_KEY_PROMISE_DISPATCH: 'promiseDispatch',
            DATA_KEY_DEFERRED: 'modalDeferred',
            DATA_KEY_RETURN_DEFERRED: 'returnDeferred',
            DATA_KEY_REJECT_ON_DISMISS: 'rejectOnDismiss',
            VALUE_PENDING_DEFERRED_STATE: 'pending'
        },
        assignDeferred = function (dialog) {
            var deferred = $.Deferred();

            /*
             * The modal exists to allow for interactions that will resolve or
             * reject the deferred. Internal modification to the deferred's
             * state will handle closing it. External modifications should
             * result in the same as the interaction will no longer be needed.
             */
            deferred.always(function () {
                dialog.modal('hide');
            });

            dialog.data(names.DATA_KEY_DEFERRED, deferred);
        };

    $.fn.modalDeferred = function (p) {
        var collection = this,
            method_return,
            options;

        if (typeof p === 'string') {
            switch (p) {
            case 'deferred':
                method_return = collection.data(names.DATA_KEY_DEFERRED);
                break;
            default:
                collection.modal(p);
                break;
            }
        } else {
            /*
             * Combine the default options with the passed in overrides (if any) to
             * produce options for this execution
             */
            options = $.extend(
                {},
                defaults,
                (p || {})
            );

            collection.each(function () {
                var dialog = $(this);

                assignDeferred(dialog);

                dialog
                    .data(names.DATA_KEY_RETURN_DEFERRED, options.returnDeferred)
                    .data(names.DATA_KEY_REJECT_ON_DISMISS, options.rejectOnDismiss)
                    .on('show.bs.modal', function () {
                        var deferred = dialog.data(names.DATA_KEY_DEFERRED);

                        if (!deferred || deferred.state() !== names.VALUE_PENDING_DEFERRED_STATE) {
                            assignDeferred(dialog);
                        }
                    })
                    .on('hide.bs.modal', function () {
                        var deferred = dialog.data(names.DATA_KEY_DEFERRED);

                        if (deferred.state() === names.VALUE_PENDING_DEFERRED_STATE) {
                            deferred[(dialog.data(names.DATA_KEY_REJECT_ON_DISMISS) ? 'reject' : 'resolve')]();
                        }
                    })
                    .on('click', '[' + names.DATA_ATTR_PROMISE_DISPATCH + ']', function () {
                        var is_resolve_action = ($(this).data(names.DATA_KEY_PROMISE_DISPATCH) === 'resolve');

                        dialog.data(names.DATA_KEY_DEFERRED)[(is_resolve_action ? 'resolve' : 'reject')]();

                        dialog.modal('hide');
                    })
                    .modal(options);
            });
        }

        /*
         * If the above code did not dictate a method return value...
         */
        if (method_return === undef) {
            /*
             * If the collection only had one element, and the caller used the
             * `returnDeferred` option to ask for the deferred instead of the
             * collection, then we'll return the deferred. Otherwise return the
             * collection like any other jQuery plugin would do.
             */
            if (collection.length === 1 && collection.data(names.DATA_KEY_RETURN_DEFERRED)) {

                method_return = collection.data(names.DATA_KEY_DEFERRED);
            } else {
                method_return = collection;
            }
        }

        return method_return;
    };
}(this));