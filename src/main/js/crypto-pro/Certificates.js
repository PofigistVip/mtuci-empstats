Z8.define('org.mtuci.empstats.cryptopro.certificate.Model', {
	extend: 'Z8.data.Model',

	local: true,
	idProperty: 'id',

	fields: [
		new Z8.data.field.String({ name: 'id' }),
		new Z8.data.field.String({ name: 'owner', header: 'Владелец' }),
		new Z8.data.field.String({ name: 'serialNumber', header: 'Серийный номер' }),
		new Z8.data.field.Date({ name: 'validFrom', header: 'Выпущен' }),
		new Z8.data.field.Date({ name: 'validTill', header: 'Действует до' }),
		new Z8.data.field.String({ name: 'algorithm', header: 'Алгоритм' }),
		new Z8.data.field.String({ name: 'provider', header: 'Провайдер' })
	]
});
