// Doi tuong validator

function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Ham thuc hien validate
  function validate(inputElement, rule) {
    // var errorElement = getParent(inputElement, '.form-group')
    var errorMessage;
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    //Lay ra cac rule cua selector
    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "checkbox":
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  //Lay element cua form can validate
  let formElement = document.querySelector(options.form);
  if (formElement) {
    //Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //Thuc hien lap qua tung rule va validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        //Truong hop submit voi Js
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );

          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                if (input.matches(":checked")) {
                  values[input.name] = input.value;
                }
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = [];
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});

          options.onSubmit(formValues);
        }
        //Truong hop submit voi hanh vi mac dinh
        else {
          formElement.submit();
        }
      }
    };

    //Lap qua moi rule va xu ly (lang nghe su kien blur, input,...)
    options.rules.forEach(function (rule) {
      //Luu lai cac rules cho moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          // Xu ly truong hop blur khoi input
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };

          //Xu ly moi khi nguoi dung nhap vao input
          inputElement.oninput = function () {
            var errorElement = inputElement.parentElement.querySelector(
              options.errorSelector
            );
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
          };
        }
      });
    });
  }
}
// Dinh nghia rules
// Nguyen tac cua cac rules:
// 1. Khi co loi => tra ra message loi
// 2. Khi hop le => tra ra undefine
Validator.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      return value ? undefined : message || "Vui long nhap truong nay";
    }
  };
};

Validator.isEmail = function (selector) {
  return {
    selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Truong nay phai la email";
    }
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Vui long nhap toi thieu ${min} ki tu`;
    }
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Gia tri nhap vao khong chinh xac";
    }
  };
};

export {Validator}