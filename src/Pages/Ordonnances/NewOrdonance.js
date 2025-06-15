import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import {
  useAllMedicament,
  useDecrementMultipleStocks,
} from '../../Api/queriesMedicament';
import { useCreateOrdonnance } from '../../Api/queriesOrdonnance';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import imgMedicament from './../../assets/images/medicament.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useOneTraitement } from '../../Api/queriesTraitement';

export default function NewOrdonance() {
  const { id } = useParams();

  // State de navigation
  const navigate = useNavigate();

  // Query pour le Traitement Sélectionné
  const { data: selectedTraitement } = useOneTraitement(id);

  // Query pour afficher les Médicament
  const { data: medicamentsData, isLoading, error } = useAllMedicament();

  const { mutate: decrementStocks } = useDecrementMultipleStocks();

  // Query pour ajouter une COMMANDE dans la base de données
  const { mutate: createOrdonnance } = useCreateOrdonnance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ajoute des produits dans le panier sans besoins de la base de données
  const [ordonnanceItems, setOrdonnanceItems] = useState([]);

  //  Fonction pour ajouter les produit dans base de données
  const addToCart = (ordonnance) => {
    setOrdonnanceItems((prevCart) => {
      // On vérifie si le produit n'existe pas déjà
      const existingItem = prevCart.find(
        (item) => item.ordonnance._id === ordonnance._id
      );

      //  Si le produit existe on incrémente la quantité
      if (existingItem) {
        return prevCart.map((item) =>
          item.ordonnance._id === ordonnance._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      //  Sinon on ajoute le produit avec la quantité (1)
      return [...prevCart, { ordonnance, quantity: 1 }];
    });
  };

  // Fonction pour Diminuer la quantité dans le panier
  // Si la quantité est 1 alors on le supprime
  const decreaseQuantity = (ordonnanceId) => {
    setOrdonnanceItems((prevCart) =>
      prevCart
        .map((item) =>
          item.ordonnance._id === ordonnanceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Fonction pour augmenter la quantité dans le panier
  const increaseQuantity = (ordonnanceId) => {
    setOrdonnanceItems((prevCart) =>
      prevCart.map((item) =>
        item.ordonnance._id === ordonnanceId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Fonction pour vider les produits dans le panier
  const clearCart = () => {
    setOrdonnanceItems([]);
  };

  // Fonction pour calculer le total des élements dans le panier
  const totalAmount = ordonnanceItems.reduce(
    (total, item) => total + item.ordonnance.price * item.quantity,
    0
  );

  // Validation de commande et AJOUTE DANS LA BASE DE DONNEES
  const handleSubmitOrder = () => {
    // Vérification de quantité dans le STOCK
    if (ordonnanceItems.length === 0) return;

    // Vérification du stock pour chaque médicament
    const insufficientStockItems = ordonnanceItems.filter(
      (item) => item.quantity > item.ordonnance.stock
    );

    if (insufficientStockItems.length > 0) {
      const names = insufficientStockItems
        .map(
          (item) => `${item.ordonnance.name} (stock: ${item.ordonnance.stock})`
        )
        .join(', ');
      errorMessageAlert(`Stock insuffisant pour : ${names}`);
      return;
    }
    // Si tout est OK alors

    setIsSubmitting(true);
    const payload = {
      items: ordonnanceItems.map((item) => ({
        medicaments: item.ordonnance._id,
        quantity: item.quantity,
      })),
      totalAmount,
      traitement: selectedTraitement._id, // ou autre choix si tu ajoutes un select
    };

    decrementStocks(payload.items, {
      onSuccess: () => {
        createOrdonnance(payload, {
          onSuccess: () => {
            // Après on vide le panier
            clearCart();
            successMessageAlert('Ordonnance validée avec succès !');
            setIsSubmitting(false);
            navigate('/ordonnances');
          },
          onError: (err) => {
            const message =
              err ||
              err.message ||
              "Erreur lors de la validation de l'Ordonnance.";
            errorMessageAlert(message);
            setIsSubmitting(false);
          },
        });
      },
      onError: (err) => {
        const message =
          err || err.message || "Erreur lors de la validation de l'Ordonnance.";
        errorMessageAlert(message);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Traitements' breadcrumbItem='Odonnances' />

          <Row>
            {/* Panier */}
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <h4>Ordonnance Patient</h4>
                      <h5 className='text-warning'>
                        Total : {formatPrice(totalAmount)} F
                      </h5>
                    </div>
                  </CardTitle>

                  {ordonnanceItems.length === 0 && (
                    <p className='text-center'>
                      Veuillez cliquez sur un produit pour l'ajouter
                    </p>
                  )}
                  {ordonnanceItems.map((item) => (
                    <div
                      key={item.ordonnance._id}
                      className='d-flex justify-content-between align-items-center mb-2 border-bottom border-black p-2 shadow shadow-md'
                    >
                      <div>
                        <strong>{capitalizeWords(item.ordonnance.name)}</strong>
                        <div>
                          {item.quantity} × {formatPrice(item.ordonnance.price)}{' '}
                          F ={' '}
                          {formatPrice(item.ordonnance.price * item.quantity)} F
                        </div>
                      </div>
                      <div className='d-flex gap-2'>
                        <Button
                          color='danger'
                          size='sm'
                          onClick={() => decreaseQuantity(item.ordonnance._id)}
                        >
                          -
                        </Button>
                        <Button
                          color='success'
                          size='sm'
                          onClick={() => increaseQuantity(item.ordonnance._id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}

                  <hr />

                  {isSubmitting && <LoadingSpiner />}

                  {ordonnanceItems.length > 0 && !isSubmitting && (
                    <div className='d-flex gap-4 mt-3'>
                      <Button
                        color='warning'
                        className='fw-bold'
                        onClick={clearCart}
                      >
                        Annuler
                      </Button>

                      <div className='d-grid' style={{ width: '100%' }}>
                        <Button
                          color='primary'
                          className='fw-bold'
                          onClick={handleSubmitOrder}
                        >
                          Valide
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
            {/* Liste des produits */}
            <Col md={12}>
              <Card>
                <CardBody>
                  {isLoading && <LoadingSpiner />}
                  {error && (
                    <div className='text-danger text-center'>
                      Une erreur est survenue ! Veuillez actualiser la page.
                    </div>
                  )}
                  <Row>
                    {!error &&
                      medicamentsData?.length > 0 &&
                      medicamentsData?.map((ordonnance) => (
                        <Col md={3} sm={6} key={ordonnance._id}>
                          <Card
                            className='shadow shadow-lg'
                            onClick={() => addToCart(ordonnance)}
                            style={{ cursor: 'pointer' }}
                          >
                            <CardImg
                              style={{
                                height: '100px',
                                objectFit: 'contain',
                              }}
                              src={
                                ordonnance.imageUrl
                                  ? ordonnance.imageUrl
                                  : imgMedicament
                              }
                              alt={ordonnance.name}
                            />
                            <CardBody>
                              <CardText className='text-center'>
                                {capitalizeWords(ordonnance.name)}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                Stock:{' '}
                                {ordonnance.stock >= 10 ? (
                                  <span className='text-primary'>
                                    {' '}
                                    {ordonnance.stock}{' '}
                                  </span>
                                ) : (
                                  <span className='text-danger'>
                                    {' '}
                                    {ordonnance.stock}{' '}
                                  </span>
                                )}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                {formatPrice(ordonnance.price)} F
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
