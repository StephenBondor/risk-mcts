import {useState} from 'react';

function rollOneDice() {
	return Math.floor(Math.random() * Math.floor(6)) + 1;
}

function ThreeVTwo() {
	const [attack, defend] = [
		[rollOneDice(), rollOneDice(), rollOneDice()],
		[rollOneDice(), rollOneDice()],
	];
	attack.sort((a, b) => b - a);
	defend.sort((a, b) => b - a);
	if (attack[0] > defend[0]) {
		if (attack[1] > defend[1]) return [0, -2];
		else return [-1, -1];
	} else {
		if (attack[1] > defend[1]) return [-1, -1];
		else return [-2, 0];
	}
}

function ThreeVOne() {
	const [attack, defend] = [
		[rollOneDice(), rollOneDice(), rollOneDice()],
		rollOneDice(),
	];
	attack.sort((a, b) => b - a);
	if (attack[0] > defend) return [0, -1];
	else return [-1, 0];
}

function attack(start, list, mcCount) {
	let stats = [];

	for (let mc = 0; mc < mcCount; mc += 1) {
		let troopsLeft = [];
		let attacker = start;
		let a;
		let d;
		let lastIndex = -1;
		for (let def = 0; def < list.length && attacker > 3; def += 1) {
			for (let defender = list[def]; defender > 0 && attacker > 3; ) {
				if (defender > 1) {
					[a, d] = ThreeVTwo();
					attacker += a;
					defender += d;
				} else {
					[a, d] = ThreeVOne();
					attacker += a;
					defender += d;
				}
				if (defender === 0) {
					lastIndex = def;
					let temp = attacker - 1;
					troopsLeft.push(temp);
					attacker -= 1;
				}
			}
		}
		let attackerCount = attacker;
		stats.push({attackerCount, lastIndex, troopsLeft});
	}
	const winners = stats.filter((i) => i.lastIndex === list.length - 1);
	const conquored = winners.length / mcCount;
	const averageTroopsLeft =
		winners.reduce((r, i) => r + i.attackerCount, 0) / winners.length;

	function sumArrays(...arrays) {
		const result = Array.from({length: list.length});
		return result.map((_, i) =>
			arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
		);
	}

	const averageWinningPath = sumArrays(
		...winners.map((i) => i.troopsLeft)
	).map((i) => Math.round(i / winners.length));

	const noWinnersBelowPath = winners
		.map((i) => i.troopsLeft)
		.reduce((r, i) => {
			const results = Array.from({length: list.length});
			return results.map((_, j) => Math.min(r[j], i[j]));
		}, winners.map((i) => i.troopsLeft)[0]);

	return [
		`% of simulations which conquer all territories: ${
			Math.round(conquored * 10000) / 100
		}%`,
		`Average Troops Left if won: ${Math.round(averageTroopsLeft)}`,
		`Average winning path: ${averageWinningPath}`,
		`No winner below path: ${noWinnersBelowPath}`,
	];
}

function App() {
	const [start, setStart] = useState(12);
	const [def, setDef] = useState('20, 1');
	const [res, setRes] = useState(['nothing yet..']);
	const [sims, setSims] = useState(1000);
	const list = def.split(',').map((i) => Number(i.trim()));

	const handleSubmit = (e) => {
		e.preventDefault();
		setRes(attack(Number(start), list, sims));
	};
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Simulations <br />
					<input
						type='number'
						value={sims}
						onChange={(e) => {
							setSims(e.target.value);
						}}
					/>
				</label>
				<br />
				<label>
					Start Amount <br />
					<input
						type='number'
						value={start}
						onChange={(e) => {
							setStart(e.target.value);
						}}
					/>
				</label>
				<br />
				<label>
					CSL of defense values along path <br /> "1, 19, 4" etc
					<br />
					<input
						type='text'
						value={def}
						onChange={(e) => {
							setDef(e.target.value);
						}}
					/>
				</label>
				<input type='submit' value='SubmitIt' />
			</form>

			{res.map((i, key) => (
				<div key={key}>{i}</div>
			))}
		</div>
	);
}

export default App;
