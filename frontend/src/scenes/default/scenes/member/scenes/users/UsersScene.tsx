import * as React from "react";
import { useLazyLoadQuery, graphql } from "react-relay/hooks";
import { useNavigate } from "react-router";

import { Toolbar, ToolbarSeparator } from "../../../../../../components/Toolbar";
import { Button, ButtonVariant } from "../../../../../../components/Button";
import { Icon } from "../../../../../../components/Icon";
import { Table, Header, Row, Cell, SelectionMode, getSelectionCount, Empty, TableSelection, SelectionType } from "../../../../../../components/Table";
import { TextInput } from "../../../../../../components/TextInput";
import { SkeletonLine } from "../../../../../../components/Skeleton";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../../../../components/Modal";

import { UsersSceneQuery } from "./__generated__/UsersSceneQuery.graphql";
import styles from "./index.css";

export function UsersScene() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchTermData, setSearchTermData] = React.useState("");

    const [selection, setSelection] = React.useState<TableSelection | null>(null);
    const selectionCount = selection === null ? 0 : getSelectionCount(selection);

    const [startTransition, isLoading] = React.unstable_useTransition({ timeoutMs: 1000 });

	const navigate = useNavigate();

	const onSelectionChanged = React.useCallback(function(old, n) {
        setSelection(n);
    }, [setSelection]);

    const onActivate = React.useCallback(function(key) {
        navigate("./" + key);
    }, [navigate]);

    const onSearchChange = React.useCallback(function(evt: React.SyntheticEvent<HTMLInputElement>) {
        setSearchTerm(evt.currentTarget.value);

        startTransition(() => setSearchTermData(evt.currentTarget.value));
    }, []);

	const onAddClick = React.useCallback(function() {
		navigate("toevoegen");
	}, [navigate]);

    const onUpdateClick = React.useCallback(function() {
        if(selection === null || selection.type !== SelectionType.Including || selection.selection.size > 1) {
            return;
        }

        const id = selection.selection.first();
        navigate("./" + id);
    }, [navigate, selection]);

    return <>
        <h2 className={styles.title}>Gebruikers</h2>
        <Toolbar>
            {selectionCount === 0
                ? <>
                    <Button key="add" onClick={onAddClick} variant={ButtonVariant.Primary}><Icon>add</Icon> Nieuwe gebruiker</Button>
					<ToolbarSeparator />
                    <TextInput icon="search" placeholder="Zoeken..." value={searchTerm} onChange={onSearchChange} />
                </>
                : <>
                    <Button key="edit" onClick={onUpdateClick} variant={ButtonVariant.Primary} disabled={selectionCount >= 2}><Icon>edit</Icon> Bewerken</Button>
                </>
            }
        </Toolbar>

        <Table
            selectionMode={SelectionMode.Multiple}
            onSelectionChanged={onSelectionChanged}
            onActivate={onActivate}

            head={<>
                <Header>Naam</Header>
                <Header>E-mail</Header>
            </>}
            body={<React.Suspense fallback={<UserListSkeleton />}>
                <UserList searchTerm={searchTermData} />
            </React.Suspense>}
        />
    </>;
}

function onAddClick() {
    
}

function UserListSkeleton() {
    return <>
        <Row>
            <Cell colSpan="999">
                <SkeletonLine />
            </Cell>
        </Row>
        <Row>
            <Cell colSpan="999">
                <SkeletonLine />
            </Cell>
        </Row>
    </>;
}

interface UserListProps {
    searchTerm: string
}

function UserList(props: UserListProps): any {
    const data = useLazyLoadQuery<UsersSceneQuery>(graphql`
        query UsersSceneQuery($searchTerm: String) {
            users(searchTerm: $searchTerm, first: 15) @connection(key: "UsersScene_users", filters: ["searchTerm"]) {
                edges {
                    node {
                        id
                        name
                        email
                    }
                }
            }
        }
    `, { searchTerm: props.searchTerm });

    return data.users.edges && data.users.edges.length > 0 ? data.users.edges.map(e => 
        <Row key={e.node.id} selectionKey={e.node.id}>
            <Cell>{e.node.name}</Cell>
            <Cell>{e.node.email}</Cell>
        </Row>    
    ) : <Empty />;
}
