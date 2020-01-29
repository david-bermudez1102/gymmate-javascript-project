class Account < ApplicationRecord
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
end
