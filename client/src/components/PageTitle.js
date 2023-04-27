import React from 'react'

function PageTitle({title}) {
  return (
    <div>
      <h1 data-testid="pagetitle" id="pagetitle" className="text-xl">
        {title}
      </h1>
    </div>
  );
}

export default PageTitle