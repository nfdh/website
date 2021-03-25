import * as React from "react";
import { useLazyLoadQuery, graphql } from "react-relay/hooks";
import { useNavigate } from "react-router";

import { Toolbar, ToolbarSeparator } from "../../../../../../components/Toolbar";
import { Button, ButtonVariant } from "../../../../../../components/Button";
import { Icon } from "../../../../../../components/Icon";
import { Table, Header, Row, Cell, SelectionMode, getSelectionCount, Empty } from "../../../../../../components/Table";
import { TextInput } from "../../../../../../components/TextInput";
import { SkeletonLine } from "../../../../../../components/Skeleton";

import { UsersSceneQuery, UserRole } from "./__generated__/UsersSceneQuery.graphql";
import styles from "./index.css";

export function UsersScene() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchTermData, setSearchTermData] = React.useState("");

    const [selectionCount, setSelectionCount] = React.useState(0);
    const [startTransition, isLoading] = React.useTransition({ timeoutMs: 1000 });

    const onSelectionChanged = React.useCallback(function(old, n) {
        setSelectionCount(getSelectionCount(n));
    }, []);

    const onActivate = React.useCallback(function(key) {
        console.log("activate", key);
    }, []);

    const onSearchChange = React.useCallback(function(evt: React.SyntheticEvent<HTMLInputElement>) {
        setSearchTerm(evt.currentTarget.value);

        startTransition(() => setSearchTermData(evt.currentTarget.value));
    }, []);

	const navigate = useNavigate();

	const onAddClick = React.useCallback(function() {
		navigate("toevoegen");
	}, [navigate]);

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
                    <Button key="edit" onClick={onAddClick} variant={ButtonVariant.Primary} disabled={selectionCount >= 2}><Icon>edit</Icon> Bewerken</Button>
                    <Button onClick={onAddClick} danger><Icon>delete</Icon> Verwijderen</Button>
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
