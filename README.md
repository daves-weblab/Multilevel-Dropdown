# Multilevel-Dropdown
Multilevel Dropdown Plugin for jQuery. Can be setup via HTML or Javascript alone.

>This Plugin is currently in version 0.3 and still in development, not for production yet fully.

## Version 0.4
* responsiveness, rearrange levels depending on the position of the dropdown and the screen size

## Version 1.0
* add datasets
* remove datasets

## Documentation
In the provided example are three basic ways to setup a Multilevel Dropdown. This is how the example looks like per default:
![Multilevel Dropdown Example](http://dev.daves-weblab.com/multilevel-dropdown/images/example.png)

### Setup
A Multilevel Dropdown can be set up in two different ways, either using HTML or Javascript (or both at the same time). 
>Every DOM element with the "data-multilevel-dropdown" attripute will be setup automatically (only works with HTML obviously tho).

Once setup the javascript will create a container with a display for the current value, a hidden select for submitting inside a form and the dropdown structure.

A Multilevel Dropdown will look like this after the javascript initialized everything, regardless of the way it is set up:
```html
<div class="multilevel-dropdown-container">
  <div class="multilevel-dropdown-display">
    <span class="multilevel-dropdown-value">xxx</span>
    <i class="fa fa-angle-down multilevel-dropdown-arrow">
  </div>
  
  <select class="multilevel-dropdown-select" name="xxx">...</select>
  
  <ul class="multilevel-dropdown">
    ...
  </ul>
</div>
```

##### HTML without Container
The following example creates a dropdown without defining a container. While this is okay to do, note that the class "multilevel-dropdown" is missing, so the list will be visible until the javascript ticks in. 

```html
<ul data-multilevel-dropdown data-dropdown-value="val2">
    <li data-value="val1">Val1</li>

    <ul data-label="Group1">
        <li data-value="val2">Val2</li>

        <ul data-label="Group2">
            <li data-value="val3">Val3</li>
        </ul>
    </ul>
</ul>
```

##### Javascript
If it is simplier to set up the dropdown with javascript only, depending on the project, this can be achieved with the following set up (this will produce the same result as the example above):

###### HTML Markup
```html
<div class="my-dropdown"></div>
```

###### Javascript Code
```javascript
$('.my-dropdown').multilevelDropdown({
  name: 'name_attribute_for_the_hidden_select', // required, default none
  value: 'pre_selected_value' // default none
  data: [{
    label: 'Val1',
    value: 'val1'
  }, {
    label: 'Group1',
    children: [{
      label: 'Val2',
      value: 'val2'
    }, {
      label: 'Group2',
      children: [{
        label: 'Val3',
        value: 'val3'
      }]
      }
    }]
  }]
});
```

>The container of the dropdown will keep the class "my-dropdown".

##### HTML with Container
The preffered way to set up a Multilevel Dropdown is by defining a specific HTML beforehand, if the data is being set up by using HTML or javascript does not matter.

```html
<div class="multilevel-dropdown-container">
  <select name="xxx">
    ...
    <option></option>
    ...
  </select>
  
  <!-- dropdown HTML markup or javascript data options -->
</div>
```

The advantage of this approach is, if javascript is disabled there is still a valid select. If Javascript is enabled Multilevel Dropdown won't produce duplicate options.

>If using HTML to set up the dropdowns data, give the ul the "multilevel-dropdown" class, so it wont be displayed at start up.

### Available Functions
Functions can be called by the typical plugin syntax:
```javascript
$dropdown.multilevelDropdown('functionName')
```

##### multilevelDropdown('getValue')
retrieve the currently selected value
>$dropdown.val() works as well

<br/>

##### multilevelDropdown('setValue', value)
set the new value
>$dropdown.val(value) works as well

<br/>

##### multilevelDropdown('open')
open the dropdown

<br/>

##### multilevelDropdown('close')
close the dropdown

<br/>

##### multilevelDropdown('toggle')
toggle the dropdown

<br/>

##### multilevelDropdown('addDataset', dataset)
>not yet supported, coming in version 1.0

<br/>

##### multilevelDropdown('removeDataset', dataset)
>not yet supported, coming in version 1.0
