/*
 * Next steps:
 *     1) pass data from interacted element to the resolve
 *     2) pass data from interacted element to the reject (harder because
 *         we don't have any direct interaction wired with dismissals)
 *     3) allow modal re-use via external calls of bs.modal's show/hide
 */
(function (context) {
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
        };

    $.fn.modalDeferred = function (options) {
        var collection = this,
        single_deferred;

        /*
         * Combine the default options with the passed in overrides (if any) to
         * produce options for this execution
         */
        options = $.extend(
            {},
            defaults,
            (options || {})
        );

        collection.each(function () {
            var dialog = $(this),
                deferred = $.Deferred(),
                resolved;

            /*
             * Store the deferred on the element's data for later public access
             */
            dialog.data('deferred', deferred);

            if (collection.length === 1) {
                single_deferred = deferred;
            }

            resolved = !options.rejectOnDismiss;

            dialog
                .on('hidden.bs.modal', function () {
                    deferred[(resolved ? 'resolve' : 'reject')]();
                })
                .on('click', '[data-promise]', function () {
                    resolved = $(this).attr('data-promise') === 'resolve';
                    dialog.modal('hide');
                })
                .modal(options);

                /*
                 * The modal exists to allow for interactions that will resolve or
                 * reject the deferred. Internal modification to the deferred's
                 * state will handle closing it. External modifications should
                 * result in the same as the interaction will no longer be needed.
                 */
                deferred.always(function () {
                    dialog.modal('hide');
                });
        });

        /*
         * If the collection only had one element, and the caller used the
         * `returnDeferred` option to ask for the deferred instead of the
         * colleciton, then we'll return the deferred. Otherwise return the
         * collection as any other jQuery plugin would do.
         */
        return (options.returnDeferred && single_deferred) ? single_deferred : collection;
    };
}(this));