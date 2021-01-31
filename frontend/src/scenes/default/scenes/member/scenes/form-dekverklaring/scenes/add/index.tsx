import * as React from "react";
import classnames from "classnames";

import { useRelayEnvironment } from "react-relay/hooks"; 
import { useNavigate } from "react-router-dom";

import { Spinner } from "../../../../../../../../components/Spinner";
import { Icon } from "../../../../../../../../components/Icon";
import { Button, ButtonVariant, ButtonProps } from "../../../../../../../../components/Button";
import { TextInput, TextArea } from "../../../../../../../../components/TextInput";
import { Radio } from "../../../../../../../../components/Radio";

import { commitSendDekverklaring } from "./mutations/SendDekverklaringMutation";

import * as styles from "./index.css";

let idGenerator = 0;

interface AddDekgroepAction {
	type: "add_dekgroep",
	payload: {
		dekgroepKey: number,
		ramKey: number
	}
}

interface RemoveDekgroepAction {
	type: "remove_dekgroep",
	payload: {
		dekgroepKey: number
	}
}

interface AddRamAction {
	type: "add_ram",
	payload: {
		dekgroepKey: number,
		ramKey: number
	}
}

interface RemoveRamAction {
	type: "remove_ram" ,
	payload: {
		dekgroepKey: number,
		ramKey: number
	}
}

type Action = AddDekgroepAction | RemoveDekgroepAction | AddRamAction | RemoveRamAction;

type State = {
	key: number,
	rammen: {
		key: number
	}[]
}[];

function reducer(state: State, action: Action) {
	switch(action.type) {
		case "add_dekgroep":
			return [
				...state,
				{
					key: action.payload.dekgroepKey,
					rammen: [
						{
							key: action.payload.ramKey
						}
					]
				}
			];

		case "add_ram":
			return state.map(g => g.key == action.payload.dekgroepKey
				? {
					...g,
					rammen: [
						...g.rammen,
						{
							key: action.payload.ramKey
						}
					]
				}
				: g
			);

		case "remove_ram":
			const newDekgroepen = [...state];
			for(let i = 0; i < newDekgroepen.length; i++) {
				if(newDekgroepen[i].key !== action.payload.dekgroepKey) 
					continue;

				const newRammen = newDekgroepen[i].rammen.filter(r => r.key != action.payload.ramKey);
				if(newRammen.length === 0) {
					newDekgroepen.splice(i, 1);
				}
				else {
					newDekgroepen[i].rammen = newRammen;
				}
				break;
			}
			return newDekgroepen;
	}
}

function initialState() {
	return [
		{
			key: idGenerator++,
			rammen: [
				{
					key: idGenerator++
				}
			]
		}
	]
}

export function AddFormDekverklaringScene() {
	const [state, dispatch] = React.useReducer(reducer, null, initialState);

	const onAddDekgroepClick = React.useCallback(function(evt: React.MouseEvent) {
		dispatch({
			type: "add_dekgroep",
			payload: {
				dekgroepKey: idGenerator++,
				ramKey: idGenerator++
			}
		});
		evt.preventDefault();
	}, []);
	
	const onAddRamClick = React.useCallback(function(evt: React.MouseEvent, dekgroepKey: number) {
		dispatch({
			type: "add_ram",
			payload: {
				dekgroepKey: dekgroepKey,
				ramKey: idGenerator++
			}
		});
		evt.preventDefault();
	}, []);

	const onRemoveRamClick = React.useCallback(function(evt: React.MouseEvent, { dekgroepKey, ramKey }: { dekgroepKey: number, ramKey: number }) {
		dispatch({
			type: "remove_ram",
			payload: {
				dekgroepKey: dekgroepKey,
				ramKey: ramKey
			}
		});
		evt.preventDefault();
	}, []);

	const [isBusy, setIsBusy] = React.useState(false);
	const seasonRef = React.useRef<HTMLInputElement>();
	const nameRef = React.useRef<HTMLInputElement>();
	const studbook1Ref = React.useRef<HTMLInputElement>();
	const studbook2Ref = React.useRef<HTMLInputElement>();
	const kovoRef = React.useRef<HTMLInputElement>();
	const koeRef = React.useRef<HTMLInputElement>();
	const koolRef = React.useRef<HTMLInputElement>();
	const korlRef = React.useRef<HTMLInputElement>();
	const refs: React.MutableRefObject<{ [key: number]: React.RefObject<HTMLInputElement> }> = React.useRef({});
	const remarkRef = React.useRef<HTMLTextAreaElement>();
	
	const relayEnvironment = useRelayEnvironment();

	const onFormSubmit = React.useCallback(function(evt: React.SyntheticEvent) {
		setIsBusy(true);
		evt.preventDefault();

		const season = seasonRef.current.value;
		const name = nameRef.current.value;
		const studbook1 = studbook1Ref.current.checked;
		const studbook2 = studbook2Ref.current.checked;
		const kovo = kovoRef.current.value;
		const koe = koeRef.current.value;
		const kool = koolRef.current.value;
		const korl = korlRef.current.value;

		const dekgroepen = [];
		for (let i = 0; i < state.length; i++) {
			const no = refs.current[state[i].key].current.value;
			const stateRammen = state[i].rammen;
			const rammen = [];
			for(let g = 0; g < stateRammen.length; g++) {
				const code = refs.current[stateRammen[g].key].current.value;
				rammen.push(code);
			}
			dekgroepen.push({
				ewe_count: no,
				rammen
			});
		}

		const remarks = remarkRef.current.value;	

		commitSendDekverklaring(
			relayEnvironment,
			{
				season: parseInt(season, 10),
				name,
				studbook:
					studbook1 ? "DRENTS_HEIDESCHAAP" : "SCHOONEBEEKER",
				kovo: parseInt(kovo, 10),
				koe: parseInt(koe, 10),
				kool: parseInt(kool, 10),
				korl: parseInt(korl, 10),
				dekgroepen,
				remarks
			},
			function(error) {
				console.log("ERORR!");
			},
			function(response, errors) {
				if(!errors){
					navigate("../verzonden");
				}
				else {
					console.log("ERROR!");
				}
			}
		);

		setIsBusy(false);
	}, [state, relayEnvironment]);

	const navigate = useNavigate();

	const onFormCancel = React.useCallback(function(evt: React.SyntheticEvent) {
		navigate("../");
		evt.preventDefault();
	}, []);

	return <div>
		<h2 className={styles.title}>Nieuwe dekverklaring indienen</h2>
		<form action="#" onSubmit={onFormSubmit}>
			<div className={styles.section}>
				<div className={styles.row}>
					<label className={styles.label} htmlFor="tids">Dekseizoen</label>
					<div className={classnames(styles.inputContainer, styles.seasonInputContainer)}>
						<TextInput type="number" id="tids" ref={seasonRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
				<div className={styles.row}>
					<label className={styles.label} htmlFor="tisl">Naam stamboeklid</label>
					<div className={styles.inputContainer}>
						<TextInput type="text" id="tisl" maxLength={255} ref={nameRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
				<div className={styles.row}>
					<label className={styles.label} htmlFor="tisb">Stamboek</label>
					<div className={classnames(styles.inputContainer, styles.studbookContainer)}>
						<Radio name="studbook" label="Drents Heideschaap" value="0" ref={studbook1Ref} /><br />
						<Radio name="studbook" label="Schoonebeeker" value="1" ref={studbook2Ref} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
			</div>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Aantal dieren in kudde (Kuddeovereenkomst)</h3>
				<div className={styles.row}>
					<label className={classnames(styles.label, styles.koLabel)} htmlFor="tikovo">Aanwezige volwassen ooien <span>Geboren in 2018 en eerder</span></label>
					<div className={classnames(styles.inputContainer, styles.koInputContainer)}>
						<TextInput type="number" id="tikovo" ref={kovoRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
				<div className={styles.row}>
					<label className={classnames(styles.label, styles.koLabel)} htmlFor="tikoe">Aanwezige enters <span>Geboren in 2019</span></label>
					<div className={classnames(styles.inputContainer, styles.koInputContainer)}>
						<TextInput type="number" id="tikoe" ref={koeRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
				<div className={styles.row}>
					<label className={classnames(styles.label, styles.koLabel)} htmlFor="tiol">Geboren ooilammeren <span>Geboren in 2020</span></label>
					<div className={classnames(styles.inputContainer, styles.koInputContainer)}>
						<TextInput type="number" id="tiol" ref={koolRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
				<div className={styles.row}>
					<label className={classnames(styles.label, styles.koLabel)} htmlFor="tirl">Geboren ramlammeren <span>Geboren in 2020</span></label>
					<div className={classnames(styles.inputContainer, styles.koInputContainer)}>
						<TextInput type="number" id="tirl" ref={korlRef} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
			</div>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Dekgroepen</h3>
				<p className={styles.sectionText}>
					Geef hieronder van alle rammen (in eigendom of gehuurd) op die u op uw eigen ooien heeft ingezet.<br />
					Een dekgroep is een groep ooien waarop een of meerdere rammen voor de dekkerij is ingezet.<br />
					Voeg rammen toe aan een dekgroep als er meerdere rammen in de dekgroep zijn ingezet.<br />
					Vul Aantal ooien = 0 en Ram 1 = 0 in als er niet gefokt wordt.
				</p>

				{state.map((dg, i) =>
					<div className={styles.dekgroep} key={dg.key}>
						<h4 className={styles.dekgroepTitle}>Dekgroep {i + 1}</h4>
						<div className={styles.row}>
							<label className={classnames(styles.label, styles.dekgroepLabel)} htmlFor={"dkao" + dg.key}>Aantal ooien</label>
							<div className={classnames(styles.inputContainer, styles.dekgroepCountInputContainer)}>
								<TextInput type="number" id={"dkao" + dg.key} ref={getOrCreateRef(refs.current, dg.key)} />
							</div>
							<div className={styles.errorContainer}></div>
						</div>
						{dg.rammen.map((r, ri) => 
							<div className={styles.row} key={r.key}>
								<label className={classnames(styles.label, styles.dekgroepLabel)} htmlFor={"dkr" + r.key}>Ram {ri + 1}</label>
								<div className={classnames(styles.inputContainer, styles.dekgroepRamInputContainer)}>
									<TextInput type="text" id={"dkr" + r.key} placeholder="Levensnummer (12 cijfers)" ref={getOrCreateRef(refs.current, r.key)} />
								</div>
								{ri === 0 && i === 0 ? null : <Button className={styles.removeRamButton} danger onClick={onRemoveRamClick} eventData={{ dekgroepKey: dg.key, ramKey: r.key}}><Icon>remove</Icon></Button>}
								<div className={styles.errorContainer}></div>
							</div>
						)}
						<div className={styles.row}>
							<Button className={styles.addRamButton} onClick={onAddRamClick} eventData={dg.key}><Icon>add</Icon> Ram toevoegen</Button>
						</div>
					</div>
				)}
				<div className={styles.row}>
					<Button className={styles.addDekgroepButton} onClick={onAddDekgroepClick}><Icon>add</Icon> Dekgroep toevoegen</Button>
				</div>
			</div>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Opmerking</h3>
				<p className={styles.sectionText}>
					Alle goedgekeurde fokrammen in eigendom dienen verantwoord te worden, dus of hierboven als eigen inzet en/of hier beneden als verhuurde of niet ingezette ram.<br />
					Een niet verantwoorde fokram krijgt 40 dekkingen op zijn conto bijgeteld.
					Indien eenzelfde fokram meerdere keren per dekseizoen wordt verhuurd: iedere verhuur = vermelden op nieuwe regel.<br />
					Indien een fokram die u zelf inzet, ook wordt verhuurd, dan de fokram zowel hierboven als hieronder vermelden.<br />
					Levensnummer fokram + vermelding: naam huurder / buiten vereniging / niet ingezet				
				</p>
				<div className={styles.row}>
					<div className={styles.inputContainer}>
						<TextArea ref={remarkRef} maxLength={10000} />
					</div>
					<div className={styles.errorContainer}></div>
				</div>
			</div>
			<div className={styles.buttonSet}>
				<Button type="submit" className={styles.button} variant={ButtonVariant.Primary} disabled={isBusy}>
					{isBusy ? <Spinner /> : null }
					Versturen
				</Button>
				<Button className={styles.button} onClick={onFormCancel}>Annuleren</Button>
			</div>
		</form>
	</div>;
}

function getOrCreateRef(refs: { [key: number]: React.Ref<HTMLInputElement> }, key: number) {
	let value = refs[key];
	if(!value) {
		value = React.createRef();
		refs[key] = value;
	}

	return value;
}
