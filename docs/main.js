(async () => {

	const scheduleElement = document.getElementById('schedule');

	// 
	const cacheBusting = new Date().toLocaleString('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		hour12: false,
	});

	// 
	const getCoopGroupingSchedule = async () => {

		const response = await fetch(`data/coop-grouping-schedule.json?v=${cacheBusting}`);
		const coopGroupingSchedule = await response.json();

		return [
			...coopGroupingSchedule.regularSchedules.nodes,
			...coopGroupingSchedule.bigRunSchedules.nodes,
		];

	};

	const nodes = await getCoopGroupingSchedule();

	// 
	const getLocale = async () => {

		const response = await fetch(`data/locale/ja-JP.json?v=${cacheBusting}`);
		const locale = await response.json();

		return locale;

	};

	const locale = await getLocale();

	// 
	const dtf = new Intl.DateTimeFormat('ja-JP', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

	const dateToString = date => dtf.format(date);

	// 
	const getWeaponName = weapon => {

		if (
			weapon.image.url
			.endsWith('/9d7272733ae2f2282938da17d69f13419a935eef42239132a02fcf37d8678f10_0.png')
		) {
			return 'クマサン印のランダム';
		} else {
			return locale.weapons[weapon.__splatoon3ink_id].name;
		}

	};

	// 
	const nodeToString = node => {

		const startDate = new Date(node.startTime);
		const endDate = new Date(node.endTime);

		const coopStage = node.setting.coopStage;
		const boss = node.setting.boss;
		const weapons = node.setting.weapons;

		return `${dateToString(startDate)}–${dateToString(endDate)}\n` +
			`${locale.stages[coopStage.id].name} ${locale.bosses[boss.id].name}\n\n` +
			'メインウェポン 一覧:\n\n' +
			weapons.map(weapon => `・${getWeaponName(weapon)}`).join('\n');

	};

	// 
	scheduleElement.textContent = nodes
		.sort((nodeA, nodeB) => {
			const startDateA = new Date(nodeA.startTime);
			const startDateB = new Date(nodeB.startTime);
			return startDateA.getTime() - startDateB.getTime();
		})
		.map(node => nodeToString(node)).join('\n\n---\n\n');

})();
