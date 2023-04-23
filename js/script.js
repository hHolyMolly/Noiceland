//< " ПОДКЛЮЧЕНИЕ JS КОМПОНЕНТОВ " >=============================================================================================================>//

function mySpollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');

	if (spollersArray.length > 0) {
		// Получение обычных спойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных спойлеров
		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}

		// Получение спойлеров с медиа запросами
		const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
			return item.dataset.spollers.split(",")[0];
		});

		// Инициализация спойлеров с медиа запросами
		if (spollersMedia.length > 0) {
			const breakpointsArray = [];
			spollersMedia.forEach(item => {
				const params = item.dataset.spollers;
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});

			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});

			// Работаем с каждым брейкпоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);

				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Событие
				matchMedia.addListener(function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_active');
					_slideToggle(spollerTitle.nextElementSibling, 500);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
			if (spollerActiveTitle) {
				spollerActiveTitle.classList.remove('_active');
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			}
		}
	}

	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}
mySpollers(); // СПОЙЛЕРЫ

function myBurger() {
	if (document.getElementById("header-menu")) {
		const header = document.querySelector(".header");
		const burgerOpen = document.getElementById("menu-open");
		const burgerContent = document.getElementById("menu-content");
		const body = document.querySelector("body");

		if (burgerOpen && burgerContent && header) {
			burgerOpen.addEventListener("click", function () {
				header.classList.toggle("_active");
				burgerContent.classList.toggle("_active");
				burgerOpen.classList.toggle("_active");
				body.classList.toggle("_lock-scroll");
			});

			if (document.querySelector("[data-popup-open]")) {
				function popupTarget() {
					const buttons = document.querySelectorAll("[data-popup-open]")

					buttons.forEach(button => {
						button.addEventListener("click", function () {
							header.classList.remove("_active");
							burgerContent.classList.remove("_active");
							burgerWrap.classList.remove("_active");
						});
					});
				}
				popupTarget()
			}
		}
	}
}
myBurger(); // МЕНЮ БУРГЕР

function myForms() {
	const forms = document.querySelectorAll("form");

	if (forms.length > 0) {
		let error = 0;

		let textError;
		let ErrorNullValue = "This is a required field";

		forms.forEach(form => {
			const inputs = form.querySelectorAll("input");
			const textareas = form.querySelectorAll("textarea");
			const checkboxs = form.querySelectorAll('input[type="checkbox"]');
			const phones = form.querySelectorAll('input[type="tel"]');

			if (form.classList.contains("_required")) {
				form.addEventListener("submit", formValid);
				inputs.forEach(input => {
					input.addEventListener("focus", formFocus);
				});
				textareas.forEach(textarea => {
					textarea.addEventListener("focus", formFocus);
				});
				inputs.forEach(input => {
					input.addEventListener("blur", function (e) {
						const elementTarget = e.target;

						if (!elementTarget.classList.contains("_invalid")) {
							elementTarget.classList.add("_invalid");

							textError = this.getAttribute("data-form-prompt");
							if (textError === null || textError === "") {
								textError = `${ErrorNullValue}`;
							}

							if (input.value.match(/^[ ]+$/)) {
								input.classList.add("_invalid");
								error++;
								input.value = '';
							}

							if (!elementTarget.classList.contains("_email") && !elementTarget.classList.contains("_password") && !elementTarget.classList.contains("_phone")) {
								if (input.value.length < 2) {
									input.classList.add("_invalid");
									let textInfo = `${textError}`;
									formBlur(textInfo, e)
								} else {
									input.classList.remove("_invalid");
								}
							}
							if (elementTarget.classList.contains("_email")) {
								const emailValid = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

								function validateEmail(value) {
									return emailValid.test(value);
								}

								if (!validateEmail(input.value)) {
									input.classList.add("_invalid");
									let textInfo = `${textError}`;
									formBlur(textInfo, e)
								} else {
									input.classList.remove("_invalid");
								}
							}
							if (elementTarget.classList.contains("_password")) {
								const minimum8Chars = /^.{8,}$/;
								const beginWithoutDigit = /^\D.*$/;
								const withoutSpecialChars = /^[^-() /]*$/;
								const containsLetters = /^.*[a-zA-Z]+.*$/;
								if (minimum8Chars.test(input.value) && beginWithoutDigit.test(input.value) && withoutSpecialChars.test(input.value) && containsLetters.test(input.value)) {
									input.classList.remove("_invalid");
								} else {
									input.classList.add("_invalid");
									let textInfo = `${textError}`;
									formBlur(textInfo, e)
								}
							}
							if (elementTarget.classList.contains("_phone")) {
								phones.forEach(phone => {
									const requiredPhone = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
									const valid = requiredPhone.test(phone.value);

									if (!valid) {
										input.classList.add("_invalid");
									} else {
										input.classList.remove("_invalid");
									}
								});

								let textInfo = `${textError}`;
								formBlur(textInfo, e)
							}
						}
					});
				});
				textareas.forEach(textarea => {
					textarea.addEventListener("blur", function (e) {
						const elementTarget = e.target;

						if (!elementTarget.classList.contains("_invalid")) {
							textError = this.getAttribute("data-form-prompt");
							if (textError === null || textError === "") {
								textError = `${ErrorNullValue}`;
							}

							if (textarea.value.match(/^[ ]+$/)) {
								textarea.classList.add("_invalid");
								error++;
								textarea.value = '';
							}

							if (textarea.value.length < 2) {
								textarea.classList.add("_invalid");
								let textInfo = `${textError}`;

								if (textarea.classList.contains("_invalid")) {
									if (textarea.parentElement.querySelectorAll(".field__error").length < 1) {
										const template = `
											<div class="field__error field-error">
												<span class="field-error__icon">!</span>
												<div class="field-error__dropdown">
													${textInfo}
												</div>
											</div>
											`;

										textarea.parentElement.insertAdjacentHTML("beforeEnd", template);
									}
								} else {
									textarea.parentElement.querySelectorAll(".field__error").forEach(error => {
										error.remove()
									});
								}
							}
						}
					});
				});
				checkboxs.forEach(checkbox => {
					checkbox.addEventListener("change", function () {
						validCheckbox(checkbox)
					});
				});

				document.addEventListener("click", function (e) {
					const elementTarget = e.target;

					if (isMobile.any()) {
						const iconErrors = document.querySelectorAll(".field-error__icon");
						if (iconErrors.length > 0) {
							iconErrors.forEach(iconError => {
								if (!iconError.nextElementSibling.classList.contains("_active")) {
									if (elementTarget === iconError) {
										iconError.nextElementSibling.classList.add("_active");
									}
								} else {
									iconError.nextElementSibling.classList.remove("_active");

									if (elementTarget != iconError) {
										iconError.nextElementSibling.classList.remove("_active");
									}
								}
							});
						}
					}
				});
			}

			function formBlur(textInfo, e) {
				const elementTarget = e.target;

				if (elementTarget.classList.contains("_invalid")) {
					if (elementTarget.parentElement.querySelectorAll(".field__error").length < 1) {
						const template = `
							<div class="field__error field-error">
								<span class="field-error__icon">!</span>
								<div class="field-error__dropdown">
									${textInfo}
								</div>
							</div>
							`;

						elementTarget.parentElement.insertAdjacentHTML("beforeEnd", template);
					}
				} else {
					elementTarget.parentElement.querySelectorAll(".field__error").forEach(error => {
						error.remove()
					});
				}
			}

			function formFocus(e) {
				const elementTarget = e.target;
				if (elementTarget.classList.contains("_invalid")) {
					elementTarget.classList.remove("_invalid");
					elementTarget.parentElement.querySelectorAll(".field__error").forEach(error => {
						error.remove()
					});
				}
			}

			function validCheckbox(checkbox) {
				if (checkbox.classList.contains("_required")) {
					textError = checkbox.getAttribute("data-form-prompt");
					if (textError === null || textError === "") {
						textError = `${ErrorNullValue}`;
					}

					if (checkbox.checked === true) {
						checkbox.classList.remove("_invalid");
						checkbox.parentElement.querySelectorAll(".field__error").forEach(error => {
							error.remove()
						});
					} else {
						checkbox.classList.add("_invalid");
						error++;
						let textInfo = `${textError}`;

						if (checkbox.parentElement.querySelectorAll(".field__error").length < 1) {
							const template = `
										<div class="field__error field-error">
											<span class="field-error__icon">!</span>
											<div class="field-error__dropdown">
												${textInfo}
											</div>
										</div>
										`;

							checkbox.parentElement.insertAdjacentHTML("beforeEnd", template);
						}
					}
				}
			}

			function formValid(e) {
				inputs.forEach(input => {
					if (input.classList.contains("_required")) {
						textError = input.getAttribute("data-form-prompt");
						if (textError === null || textError === "") {
							textError = `${ErrorNullValue}`;
						}

						validAllInputs()

						if (!input.classList.contains("_email") && !input.classList.contains("_password") && !input.classList.contains("_phone") && !input.classList.contains("_name")) {
							let textInfo = `${textError}`;
							addError(textInfo)
						}

						if (input.classList.contains("_email")) {
							validEmail()
						}
						if (input.classList.contains("_password")) {
							validPassword()
						}
						if (input.classList.contains("_phone")) {
							validPhone()
						}

						function validEmail() {
							const emailValid = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

							function validateEmail(value) {
								return emailValid.test(value);
							}

							if (!validateEmail(input.value)) {
								input.classList.add("_invalid");
								error++;
							} else {
								input.classList.remove("_invalid");
							}

							let textInfo = `${textError}`;
							addError(textInfo)
						}

						function validPassword() {
							const minimum8Chars = /^.{8,}$/;
							const beginWithoutDigit = /^\D.*$/;
							const withoutSpecialChars = /^[^-() /]*$/;
							const containsLetters = /^.*[a-zA-Z]+.*$/;

							if (minimum8Chars.test(input.value) &&
								beginWithoutDigit.test(input.value) &&
								withoutSpecialChars.test(input.value) &&
								containsLetters.test(input.value)) {
								input.classList.remove("_invalid");
							} else {
								input.classList.add("_invalid");
								error++;
							}

							let textInfo = `${textError}`;
							addError(textInfo)
						}

						function validPhone() {
							phones.forEach(phone => {
								const requiredPhone = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
								const valid = requiredPhone.test(phone.value);

								if (!valid) {
									input.classList.add("_invalid");
									error++;
								} else {
									input.classList.remove("_invalid");
								}
							});

							let textInfo = `${textError}`;
							addError(textInfo)
						}

						function validAllInputs() {
							if (input.value.length < 2) {
								input.classList.add("_invalid");
								error++;
							} else {
								input.classList.remove("_invalid");
							}

							if (input.value.match(/^[ ]+$/)) {
								input.classList.add("_invalid");
								error++;
								input.value = '';
							}
						}

						function addError(textInfo) {
							if (input.classList.contains("_invalid")) {
								if (input.parentElement.querySelectorAll(".field__error").length < 1) {
									const template = `
										<div class="field__error field-error">
											<span class="field-error__icon">!</span>
											<div class="field-error__dropdown">
												${textInfo}
											</div>
										</div>
										`;

									input.parentElement.insertAdjacentHTML("beforeEnd", template);
								}
							} else {
								input.parentElement.querySelectorAll(".field__error").forEach(error => {
									error.remove()
								});
							}
						}
					}
				});
				textareas.forEach(textarea => {
					if (textarea.classList.contains("_required")) {
						textError = textarea.getAttribute("data-form-prompt");
						if (textError === null || textError === "") {
							textError = `${ErrorNullValue}`;
						}

						if (textarea.value.match(/^[ ]+$/)) {
							textarea.classList.add("_invalid");
							error++;
							textarea.value = '';
						}

						if (textarea.value.length < 2) {
							textarea.classList.add("_invalid");

							let textInfo = `${textError}`;

							if (textarea.classList.contains("_invalid")) {
								if (textarea.parentElement.querySelectorAll(".field__error").length < 1) {
									const template = `
										<div class="field__error field-error">
											<span class="field-error__icon">!</span>
											<div class="field-error__dropdown">
												${textInfo}
											</div>
										</div>
										`;

									textarea.parentElement.insertAdjacentHTML("beforeEnd", template);
								}
							} else {
								textarea.parentElement.querySelectorAll(".field__error").forEach(error => {
									error.remove()
								});
							}
						} else {
							textarea.classList.remove("_invalid");
						}
					}
				});
				checkboxs.forEach(checkbox => {
					validCheckbox(checkbox)
				});

				const invalids = form.querySelectorAll("._invalid");
				if (invalids.length < 1) {
					error = 0;
				}

				if (error > 0) {
					e.preventDefault();
				}
			}
		});
	}
}
myForms(); // ВАЛИДАЦИЯ ФОРМЫ

//< " СКРИПТЫ " >=============================================================================================================>//

new WOW({
	mobile: false,
	offset: 200,
}).init();

let isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
	any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

if (isMobile.any()) {
	document.body.classList.add("_touch");
} else {
	document.body.classList.add("_pc");
}

//< " СКРИПТЫ " >=============================================================================================================>//

function showCards() {
	const btn = document.querySelector("[data-show-cards]");

	if (btn) {
		btn.addEventListener("click", function () {
			async function getCards() {
				if (!btn.classList.contains('_active')) {

					btn.classList.add('_hidden');
					const file = "./json/cards.json";

					let response = await fetch(file, {
						method: "GET"
					});

					if (response.ok) {
						let result = await response.json();
						loadCards(result);
						btn.classList.remove('_hidden');
						btn.remove();
					}
				}
			}
			getCards()
		});
	}
}
showCards()

function loadCards(data) {

	const column = document.querySelector('.little-column__row');

	data.cards.forEach(item => {
		const imageUrl = item.imageUrl;
		const imageAlt = item.imageAlt;
		const label = item.label;
		const title = item.title;
		const strongBy = item.strongBy;
		const animationDelay = item.animationDelay;

		let template = `
			<article class="little-column-row__card wow animate__animated animate__fadeIn"
				data-wow-duration="1s" data-wow-delay="${animationDelay}">
				<a class="little-column-row__image _ibg" href="#">
					<img src="${imageUrl}" alt="${imageAlt}">
				</a>
				<h5 class="little-column-row__label label">${label}</h5>
				<a class="little-column-row__title" href="#">${title}</a>
				<strong class="little-column-row__text-strong text-strong">${strongBy}</strong>
			</article>
		`

		column.insertAdjacentHTML("beforeEnd", template);
	});
}