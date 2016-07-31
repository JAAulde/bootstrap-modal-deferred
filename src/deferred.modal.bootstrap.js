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
        var collection = this;

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
            var dialog = $(this);

            dialog
                .on('show.bs.modal', function () {
                    var deferred = dialog.data('modalDeferred');

                    if (!deferred || deferred.state() !== 'pending') {
                        deferred = $.Deferred();

                        /*
                         * The modal exists to allow for interactions that will resolve or
                         * reject the deferred. Internal modification to the deferred's
                         * state will handle closing it. External modifications should
                         * result in the same as the interaction will no longer be needed.
                         */
                        deferred.always(function () {
                            dialog.modal('hide');
                        });

                        dialog.data('modalDeferred', deferred);
                    }
                })
                .on('hidden.bs.modal', function () {
                    var deferred = dialog.data('modalDeferred');

                    if (deferred.state() === 'pending') {
                        deferred[(options.rejectOnDismiss ? 'reject' : 'resolve')]();
                    }
                })
                .on('click', '[data-promise]', function () {
                    var is_resolve_action = ($(this).data('promise') === 'resolve');

                    dialog.data('modalDeferred')[(is_resolve_action ? 'resolve' : 'reject')]();

                    dialog.modal('hide');
                })
                .modal(options);
        });

        /*
         * If the caller used the `returnDeferred` option to ask for the
         * deferred instead of the colleciton, and the collection only had one
         * element, then we'll return the deferred. Otherwise return the
         * collection like any other jQuery plugin would do.
         */
        return (options.returnDeferred && collection.length === 1) ? collection.data('modalDeferred') : collection;
    };
}(this));