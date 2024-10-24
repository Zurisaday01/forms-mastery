export const sidebarLinks = [
	{
		icon: 'home',
		route: '/',
		label: {
			en: 'Home',
			es: 'Inicio',
		},
		isAdmin: false,
	},
	{
		icon: 'filePlus',
		route: '/templates/new',
		label: {
			en: 'Create Template',
			es: 'Crear Plantilla',
		},
		isAdmin: false,
	},
	{
		icon: 'fileText',
		route: '/templates/my-templates',
		label: {
			en: 'My Templates',
			es: 'Mis Plantillas',
		},
		isAdmin: false,
	},
	{
		icon: 'fileCheck',
		route: '/templates/answered',
		label: {
			en: 'Answered Forms',
			es: 'Formularios Contestados',
		},
		isAdmin: false,
	},
	{
		icon: 'users',
		route: '/users',
		label: {
			en: 'Users',
			es: 'Usuarios',
		},
		isAdmin: true,
	},
];

export const questionTypes = [
	{
		label: {
			en: 'Short Answer',
			es: 'Respuesta Corta',
		},
		value: 'short',
	},
	{
		label: {
			en: 'Long Answer',
			es: 'Respuesta Larga',
		},
		value: 'long',
	},
	{
		label: {
			en: 'Number',
			es: 'Número',
		},
		value: 'number',
	},
	{
		label: {
			en: 'Multiple Choice',
			es: 'Opción Múltiple',
		},
		value: 'multiple-choice',
	},
	{
		label: {
			en: 'Checkbox',
			es: 'Cuadro de Selección',
		},
		value: 'checkbox',
	},
];

export const limitQuestionTypesDynamicLocale = {
	short: 4,
	long: 4,
	number: 4,
	checkbox: 4,
	'multiple-choice': 4,
};

export const limitQuestionTypes = {
	short: 4,
	long: 4,
	number: 4,
	checkbox: 4,
	'multiple-choice': 4,
};
