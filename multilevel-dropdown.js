/*
 @licstart  The following is the entire license notice for the
 JavaScript code in this page.

 Copyright (C) 2014  Loic J. Duros

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version.  The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.


 @licend  The above is the entire license notice
 for the JavaScript code in this page.
 */

(function ($) {

    // Multilevel Dropdown Module
    var methods = {
            // TODO any public methods needed?
        },

        private = {
            initialize: function (options) {
                // setup local options
                this.options = {
                    name: this.$.data('dropdown-name'),
                    value: this.$.data('dropdown-value'),
                    labels: {
                        reset: '<i class="fa fa-trash"></i>',
                        close: '<i class="fa fa-angle-left"></i>'
                    }
                };

                // extend local options
                $.extend(true, this.options, options);

                // create select
                this.$select = $('<select class="multilevel-dropdown-select">');
                this.$select.attr('name', this.options.name);

                // append it to the DOM
                this.$.before(this.$select);

                // place the close label in the template
                templates.level = templates.level.replace('##label##', this.options.labels.close);

                // if data is set it will be used to build the dropdown instead of using the <ul> structure
                if (!this.options.data) {
                    // no data set, has to be a <ul>

                    // reset button on stop to set value back to false
                    this.options.data = [{
                        label: this.options.labels.reset,
                        value: false,
                        children: null
                    }];

                    // read the data from the DOM
                    this.readData(this.$.children(), this.options.data);
                }

                // build the dropdown based on the data
                this.buildDropdown();

                // set a value if wanted
                if (this.options.value) {
                    this.setValue(this.options.value);
                }
            },

            readData: function (items, data) {
                var scope = this;

                // iterate items and build fetch data recursively
                items.each(function () {
                    var $item = $(this);

                    if ($item.is('li')) {
                        if($item.data('active') != undefined) {
                            private.options.value = $item.data('value');
                        }

                        // push values from <li> items to the data array
                        data.push({
                            label: $item.html(),
                            value: $item.data('value'),
                            children: null
                        });
                    } else if ($item.is('ul')) {
                        // <ul> have to be pushed and fetch recursively
                        var item = {
                            label: $item.data('label'),
                            children: []
                        };

                        data.push(item);
                        scope.readData($item.children(), item.children);
                    }
                });
            },

            buildDropdown: function () {
                // clear the dropdown
                this.$.empty();

                // build levels recursively
                this.buildLevel(this.$, this.options.data);
                this.$items = this.$.find('ul, li');

                // bind the events
                this.bindEvents();
            },

            buildLevel: function ($level, data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var $item;

                    if (item.children) {
                        // item has children, build a new level recursively
                        $item = $(templates.item)
                            .addClass('has-children')
                            .html(item.label);

                        // create level and append it to the DOM
                        var $ul = $(templates.level);
                        $item.append($ul);

                        // build next level
                        this.buildLevel($ul, item.children);
                    } else {
                        // simple item, build it and append it to the DOM
                        $item = $(templates.item)
                            .data('value', item.value)
                            .html(item.label);

                        // value == false? gotta be the reset button
                        if (item.value === false) {
                            $item.addClass('multilevel-dropdown-reset');
                        }

                        // appending time!
                        this.$select.append('<option value="' + item.value + '">' + item.label + '</option>');
                    }

                    // append whole level to the DOM
                    $level.append($item);
                }
            },

            bindEvents: function () {
                this.$items.on('click', function (event) {
                    event.stopPropagation();

                    var $item = $(this);

                    if ($item.hasClass('has-children')) {
                        if ($item.hasClass('open')) {
                            // was open, close it
                            $item.removeClass('open');
                        } else {
                            private.$items.removeClass('open');

                            $item.parents('.has-children').addClass('open');

                            // add open to all parents, so this level stays open
                            $item.addClass('open');

                            // rearrange children
                            // TODO arrange based on window size etc.
                            $item.children('.multilevel-dropdown-level').css('left', $item.outerWidth());
                        }
                    } else if ($item.hasClass('multilevel-dropdown-level-reset')) {
                        $item.closest('.multilevel-dropdown-item.has-children').removeClass('open');
                    } else {
                        // simple item was clicked, set the value
                        private.setValue($item.data('value'));
                    }
                });
            },

            addDataset: function (dataset) {
                // TODO add more options

                // update data
                this.buildDropdown();
            },

            getValue: function () {
                // fetch the value from the <select>
                return this.$select.val();
            },

            setValue: function (value) {
                this.$items.each(function () {
                    var $item = $(this);

                    // set the active class on the item with the wanted value
                    if ($item.data('value') == value) {
                        $item.addClass('active');
                    } else {
                        $item.removeClass('active');
                    }
                });

                // set the value for the <select>, so simple form submitting works too
                this.$select.val(value);

                // trigger change event!
                this.$.trigger('change');
            }
        },
        templates =
        {
            level: '<ul class="multilevel-dropdown-level"><li class="multilevel-dropdown-level-reset">##label##</li></ul>',
            item: '<li class="multilevel-dropdown-item"></li>'
        };

    // override val() for <ul> (only with the wanted class tho)
    $.valHooks.ul = {
        get: function (el) {
            if ($(el).hasClass('multilevel-dropdown')) {
                return private.getValue.apply(private);
            }
        },

        set: function (el, val) {
            if ($(el).hasClass('multilevel-dropdown')) {
                private.setValue.apply(private, val);
                return el;
            }
        }
    }

    $.fn.multilevelDropdown = function (misc) {
        if (methods[misc]) {
            return methods[misc].apply(this, arguments.slice(1))
        } else if (typeof misc === 'object' || !misc) {
            private.$ = this;
            private.initialize(misc);
        } else {
            $.error('Method ' + misc + ' does not exist for Multilevel Dropdown');
        }

        return this;
    }
})
(jQuery);