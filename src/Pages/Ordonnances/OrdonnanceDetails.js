import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Modal,
} from 'reactstrap';
import { useOneOrdonnance } from '../../Api/queriesOrdonnance';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import logo_medical from './../../assets/images/logo_medical.png';

const OrdonnanceDetails = ({
  show_modal,
  tog_show_modal,
  setShow_modal,
  selectedOrdonnanceID,
}) => {
  const {
    data: selectedOrdonnance,
    error,
    isLoading,
  } = useOneOrdonnance(selectedOrdonnanceID);

  return (
    <Modal
      isOpen={show_modal}
      toggle={() => {
        tog_show_modal();
      }}
      size={'lg'}
      scrollable={true}
      centered={true}
    >
      <div className='modal-header'>
        <h5 className='modal-title mt-0'>Ordonnance Médical</h5>
        <button
          type='button'
          onClick={() => setShow_modal(false)}
          className='close'
          data-dismiss='modal'
          aria-label='Close'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div className='modal-body'>
        {!error && !isLoading && (
          <div className='mx-5'>
            <Card
              style={{
                boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                borderRadius: '15px',
                width: '583px',
                height: '827px',
                margin: '20px auto',
                position: 'relative',
              }}
            >
              <CardBody>
                <CardHeader style={{ background: 'rgba(100, 169, 238, 0.5)' }}>
                  <CardImg
                    src={logo_medical}
                    style={{
                      width: '70px',
                      position: 'absolute',
                      top: '30px',
                      left: '10px',
                    }}
                  />
                  <CardTitle className='text-center '>
                    <h2 className='fs-bold'>Ordonnance Médical </h2>
                    <h5>Centre de Santé MARHABA</h5>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      Kabala zone universitaire sur le goudron de COURALE
                    </p>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      78-87-91-34 / 63-00-67-89
                    </p>
                  </CardTitle>
                  <CardText>
                    <strong> Date d'Ordonnance:</strong>{' '}
                    {new Date(
                      selectedOrdonnance?.ordonnances?.createdAt
                    ).toLocaleDateString()}
                  </CardText>
                  <CardImg
                    src={logo_medical}
                    style={{
                      width: '70px',
                      position: 'absolute',
                      top: '30px',
                      right: '10px',
                    }}
                  />
                </CardHeader>

                <div
                  sm='12'
                  className='my-2 px-2 border border-top border-info rounded rounded-md'
                >
                  <CardText>
                    <strong> Nom et Prénom:</strong>{' '}
                    {capitalizeWords(
                      selectedOrdonnance?.traitements?.patient['firstName']
                    )}{' '}
                    {capitalizeWords(
                      selectedOrdonnance?.traitements?.patient['lastName']
                    )}
                  </CardText>
                  <CardText>
                    <strong> Sexe:</strong>{' '}
                    {capitalizeWords(
                      selectedOrdonnance?.traitements?.patient['gender']
                    )}
                  </CardText>
                </div>

                <div className='my-3'>
                  <CardText className='d-flex justify-content-center align-items-center fs-5'>
                    <strong> Médicaments:</strong>
                  </CardText>
                  <ul className='list-unstyled'>
                    {selectedOrdonnance?.ordonnances?.items.map(
                      (medi, index) => (
                        <li
                          key={index}
                          className='border-2 border-grey border-bottom py-2  text-center'
                        >
                          {formatPrice(medi.quantity)} {' => '}
                          {capitalizeWords(medi.medicaments['name'])}
                          <span className='mx-2'>
                            {' '}
                            {capitalizeWords(
                              ' --------------------------/ jour'
                            )}
                          </span>
                          <strong className='ms-4 text-primary'>
                            {' '}
                            {formatPrice(medi?.medicaments['price'])} F
                          </strong>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </CardBody>

              <CardFooter>
                <div className='d-flex justify-content-around align-item-center'>
                  <CardText style={{ fontSize: '12px' }}>
                    <strong> Total Médicaments: </strong>{' '}
                    {formatPrice(selectedOrdonnance?.ordonnances?.totalAmount)}{' '}
                    FCFA
                  </CardText>
                  <CardText style={{ fontSize: '12px' }}>
                    <strong> Total Traitement: </strong>{' '}
                    {formatPrice(
                      selectedOrdonnance?.traitements['totalAmount']
                    )}{' '}
                    FCFA
                  </CardText>
                </div>
                <CardText className='text-center p-3'>
                  <strong> Total Général: </strong>{' '}
                  <span className='fs-5'>
                    {formatPrice(
                      selectedOrdonnance?.traitements['totalAmount'] +
                        selectedOrdonnance?.ordonnances?.totalAmount
                    )}{' '}
                    FCFA
                  </span>
                </CardText>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrdonnanceDetails;
