class Account < ApplicationRecord
  validates :name, presence: :true, format: { with: /\A[a-zA-Z]+\Z/ }
  validates :lastname, presence: :true, format: { with: /\A[a-zA-Z]+\Z/ }
  validates :username, length: { minimum: 6 }, format: { with: /\A[a-zA-Z0-9-_.]+\Z/, message:"can't have any spaces or special characters, except for dashes or dots" }, uniqueness: true
  validates :email, format: {:with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i}, uniqueness: {message:"already belongs to an existing account"}
  validates :password, presence: true, length: { in: 6..50 }, format: { without: /\s/ }, :on => :create
  validates :password, presence: true, length: { in: 6..50 }, format: { without: /\s/ }, :on => :update, :unless => lambda{ |user| user.password.to_s.empty? }


  enum sex: 0...2

  belongs_to :userable, polymorphic: true
  has_many :pictures
  has_many :videos
  has_many :likes
  has_secure_password

  def generate_auth_token
    token = SecureRandom.hex
    self.update_columns(auth_token: token)
    token
  end

  def invalidate_auth_token
    self.update_columns(auth_token: nil)
  end

  def self.search(query)
    where('name LIKE ? OR lastname LIKE ?', "%#{query}%", "%#{query}%")
  end
end
