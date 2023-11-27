import { FirebaseApi } from './firebase-api';

const mockAngularFirestore = {
  collection: jest.fn(),
};

const mockAngularFireAuth = {
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: jest.fn(),
};

const firebaseApi = new FirebaseApi(
  mockAngularFirestore as any,
  mockAngularFireAuth as any,
);

describe('FirebaseApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });



  it('should update user', async () => {
    const mockUserId = 'mockUserId';
    const mockUser = { id: mockUserId, email: 'test@example.com', type: 'user' };

    const setDocMock = jest.fn();
    const docMock = jest.fn(() => ({ set: setDocMock }));
    const collectionMock = jest.fn(() => ({ doc: docMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    await firebaseApi.updateUser(mockUser);

    expect(collectionMock).toHaveBeenCalledWith('user');
    expect(docMock).toHaveBeenCalledWith(mockUserId);
    expect(setDocMock).toHaveBeenCalledWith({
      email: mockUser.email,
      type: mockUser.type,
    });
  });

  it('should get all users', async () => {
    const mockUserSnapshot = {
      id: 'mockUserId',
      data: () => ({ email: 'test@example.com', type: 'user' }),
    };

    const getDocsMock = jest.fn(() => Promise.resolve([mockUserSnapshot]));
    const collectionMock = jest.fn(() => ({ get: getDocsMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    const users = await firebaseApi.getAllUsers();

    expect(collectionMock).toHaveBeenCalledWith('user');
    expect(getDocsMock).toHaveBeenCalled();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: 'mockUserId',
      email: 'test@example.com',
      type: 'user',
    });
  });

  it('should get all properties', async () => {
    const mockPropertySnapshot = {
      id: 'mockPropertyId',
      data: () => ({
        address: 'Mock Address',
        details: 'Mock Details',
        nBathrooms: 2,
        nBedrooms: 3,
        nRooms: 4,
        postalCode: '12345',
        price: 100000,
        propertyType: 'House',
        yearBuilt: 2020,
      }),
    };

    const getDocsMock = jest.fn(() => Promise.resolve([mockPropertySnapshot]));
    const collectionMock = jest.fn(() => ({ get: getDocsMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    const properties = await firebaseApi.getAllProperties();

    expect(collectionMock).toHaveBeenCalledWith('property');
    expect(getDocsMock).toHaveBeenCalled();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual({
      id: 'mockPropertyId',
      address: 'Mock Address',
      details: 'Mock Details',
      nBathrooms: 2,
      nBedrooms: 3,
      nRooms: 4,
      postalCode: '12345',
      price: 100000,
      propertyType: 'House',
      yearBuilt: 2020,
    });
  });

  it('should get properties containing string', async () => {
    const mockPropertySnapshot = {
      id: 'mockPropertyId',
      data: () => ({
        address: 'Mock Address',
        brokerId: 'mockBrokerId',
        details: 'Mock Details',
        nBathrooms: 2,
        nBedrooms: 3,
        nRooms: 4,
        postalCode: '12345',
        price: 100000,
        propertyType: 'House',
        yearBuilt: 2020,
      }),
    };

    const getDocsMock = jest.fn(() => Promise.resolve([mockPropertySnapshot]));
    const collectionMock = jest.fn(() => ({ get: getDocsMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    const searchString = 'Mock Broker';
    const properties = await firebaseApi.getPropertiesContainingString(searchString);

    expect(collectionMock).toHaveBeenCalledWith('property');
    expect(getDocsMock).toHaveBeenCalled();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual({
      id: 'mockPropertyId',
      address: 'Mock Address',
      brokerId: 'mockBrokerId',
      details: 'Mock Details',
      nBathrooms: 2,
      nBedrooms: 3,
      nRooms: 4,
      postalCode: '12345',
      price: 100000,
      propertyType: 'House',
      yearBuilt: 2020,
    });
  });

  it('should get user by id', async () => {
    const mockUserId = 'mockUserId';
    const mockUserSnapshot = {
      id: mockUserId,
      data: () => ({ email: 'test@example.com', type: 'user' }),
    };

    const getDocMock = jest.fn(() => Promise.resolve(mockUserSnapshot));
    const docMock = jest.fn(() => ({ get: getDocMock }));
    const collectionMock = jest.fn(() => ({ doc: docMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    const user = await firebaseApi.getUser(mockUserId);

    expect(collectionMock).toHaveBeenCalledWith('user');
    expect(docMock).toHaveBeenCalledWith(mockUserId);
    expect(getDocMock).toHaveBeenCalled();
    expect(user).toEqual({
      id: 'mockUserId',
      email: 'test@example.com',
      type: 'user',
    });
  });

  it('should update property', async () => {
    const mockPropertyId = 'mockPropertyId';
    const mockProperty = {
      id: mockPropertyId,
      address: 'Mock Address',
      details: 'Mock Details',
      nBathrooms: 2,
      nBedrooms: 3,
      nRooms: 4,
      postalCode: '12345',
      price: 100000,
      propertyType: 'House',
      yearBuilt: 2020,
    };

    const setDocMock = jest.fn();
    const docMock = jest.fn(() => ({ set: setDocMock }));
    const collectionMock = jest.fn(() => ({ doc: docMock }));
    mockAngularFirestore.collection.mockImplementation(collectionMock);

    await firebaseApi.updateProperty(
      mockPropertyId,
      mockProperty.address,
      mockProperty.details,
      mockProperty.nBathrooms,
      mockProperty.nBedrooms,
      mockProperty.nRooms,
      mockProperty.postalCode,
      mockProperty.price,
      mockProperty.propertyType,
      mockProperty.yearBuilt
    );

    expect(collectionMock).toHaveBeenCalledWith('property');
    expect(docMock).toHaveBeenCalledWith(mockPropertyId);
    expect(setDocMock).toHaveBeenCalledWith({
      address: mockProperty.address,
      details: mockProperty.details,
      nBathrooms: mockProperty.nBathrooms,
      nBedrooms: mockProperty.nBedrooms,
      nRooms: mockProperty.nRooms,
      postalCode: mockProperty.postalCode,
      price: mockProperty.price,
      propertyType: mockProperty.propertyType,
      yearBuilt: mockProperty.yearBuilt,
    });
  });

  it('should sign out', () => {
    firebaseApi.signOut();
    expect(mockAngularFireAuth.signOut).toHaveBeenCalled();
  });
});
