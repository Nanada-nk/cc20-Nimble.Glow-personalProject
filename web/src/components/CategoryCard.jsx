import { Link } from 'react-router';

function CategoryCard({ category }) {
 
  const imageUrl = category.products?.[0]?.images?.[0]?.url || 'https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png';

  return (
    <Link to={`/products?categoryId=${category.id}`} className="group card bg-base-100 shadow-xl image-full transition-transform hover:-translate-y-2">
      <figure className='h-80'>
        <img src={imageUrl} alt={category.name} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body justify-center items-center text-center">
        <h2 className="card-title text-2xl text-white drop-shadow-lg">{category.name}</h2>
      </div>
    </Link>
  );
}

export default CategoryCard;