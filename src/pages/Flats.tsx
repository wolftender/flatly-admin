 import { useContext, useState } from "react";
import { apiUrl } from "../api";
import PagedDisplay, { InvalidPageError } from "../components/PagedDisplay";
import { Session, SessionContext } from "../SessionContext";

const FlatsPage : React.FC<any> = () => {
    const [filters, setFilters] : any = useState ({ });
    const [nameFilter, setNameFilter] = useState ('');
    const [locationFilter, setLocationFilter] = useState ('');

    const session : Session = useContext (SessionContext);

    return (<div className="flatsPage pageWithPadding">
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
                { actionName: 'add', handler: async () => {
                    return false;
                } }
            ]}
            rowActions={[
                { actionName: 'inspect', handler: async (item) => {

                    return false;
                } },
                { actionName: 'test', handler: (item) => {
                    return new Promise ((resolve) => {
                        setTimeout (() => resolve(true), 3000);
                    })
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