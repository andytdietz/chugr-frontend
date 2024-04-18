/* eslint-disable react/prop-types */
export function BreweriesShow(props) {
  return (
    <div>
      <h1>{props.brewery.name}</h1>
      <h2>{props.brewery.city}</h2>
      <p>Brewery Type: {props.brewery.brewery_type}</p>
      <p>Brewery Website: {props.brewery.website_url}</p>
      <img src={props.brewery.image_url} alt={props.brewery.name} />
    </div>
  );
}
