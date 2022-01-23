import { useContext, useState } from "react";
import { apiUrl } from "../api";
import ConfirmDialog from "../components/ConfirmDialog";
import EntityInspector from "../components/EntityInspector";
import PagedDisplay, { InvalidPageError } from "../components/PagedDisplay";
import { Session, SessionContext } from "../SessionContext";

const FlatsPage : React.FC<any> = () => {
    const [filters, setFilters] : any = useState ({ });
    const [nameFilter, setNameFilter] = useState ('');
    const [locationFilter, setLocationFilter] = useState ('');
    const [currentFlat, setCurrentFlat] : any = useState (null);
    const [flatInspectOpen, setFlatInspectOpen] = useState (false);
    const [deleteOpen, setDeleteOpen] : any = useState (false);
    const [error, setError] : any = useState (null);

    const session : Session = useContext (SessionContext);

    const deleteFlat = async (id : string) => {
        return fetch (`${apiUrl}/flats/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        });
    }

    return (<div className="flatsPage pageWithPadding">
        {flatInspectOpen ? (<EntityInspector entity={currentFlat} onClose={() => setFlatInspectOpen (false)} />) : <></>}
        {!!deleteOpen && !!currentFlat ? <ConfirmDialog prompt={`Are you sure that you want to delete flat ${currentFlat.name}?`} onConfirm={async () => {
            const res : Response = await deleteFlat (currentFlat.id);

            if (res.status !== 200) {
                if (res.status === 403) {
                    setError ('missing permission to delete users');
                } else {
                    setError (`server responded with error code ${res.status}`);
                }
            }

            setDeleteOpen (false);
            setFilters (Object.assign ({}, filters));
        }} onReject={() => {
            setDeleteOpen (false);
        }} />: <></>}
        <div className="listFilters">
            <form className="modalForm" onSubmit={(e) => {
                e.preventDefault ();
                const newFilters : any = { };

                if (nameFilter.length > 0) {
                    newFilters.name = nameFilter;
                }

                if (locationFilter.length > 0) {
                    newFilters.location = locationFilter;
                }

                setFilters (newFilters);
            }}>
                <div className="label">
                    <label htmlFor="flatName">flat name: </label>
                </div>
                <div className="input">
                    <input type="text" name="flatName" onChange={(ev) => setNameFilter (ev.target.value)} />
                </div>
                <div className="label">
                    <label htmlFor="flatName">location: </label>
                </div>
                <div className="input">
                    <input type="text" name="flatLocation" onChange={(ev) => setLocationFilter (ev.target.value)} />
                </div>
                <div className="filterInputWrapper">
                    <input type="submit" value="filter" />
                </div>
            </form>
        </div>
        {!!error ? <div className="error">{error}</div> : <></>}
        <PagedDisplay 
            pageSize={10} 
            filters={filters}
            displayedProperties={[
                { propertyName: 'id', columnName: 'id' },
                { propertyName: 'name', columnName: 'name' },
                { propertyName: 'location', columnName: 'location' },
                { propertyName: 'creationTimestamp', columnName: 'created', parser: val => (new Date (val)).toLocaleString () }
            ]}
            actions={[
                { actionName: 'add flat', handler: async () => {
                    return false;
                } }
            ]}
            rowActions={[
                { actionName: 'inspect', handler: async (item) => {
                    setCurrentFlat (item);
                    setFlatInspectOpen (true);
                    return false;
                } },
                { actionName: 'delete', handler: async (item) => {
                    setCurrentFlat (item);
                    setDeleteOpen (true);
                    return false;
                } }
            ]}
            getPage={async (size : number, page : number, filters : any) => {
                const params : any = {
                    size: String (size),
                    page: String (page)
                };

                if (filters) {
                    for (const prop in filters) {
                        params [prop] = filters [prop];
                    }
                }

                const searchParams = new URLSearchParams (params);
                const res = await fetch (`${apiUrl}/flats?${searchParams}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.token}`
                    }
                });

                if (res.status === 200) {
                    return await res.json ();
                } else {
                    if (res.status == 404) {
                        throw new InvalidPageError ();
                    } else {
                        throw new Error (`server status code ${res.status}`);
                    }
                }
            }}
        />
    </div>)
};

export default FlatsPage;